import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";


// ============================================================
// HELPERS
// ============================================================

const esPlanDeTrabajoNombre = (nombre) =>
    String(nombre || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/_/g, " ")
        .toLowerCase()
        .includes("plan de trabajo");

// Fecha de hoy (YYYY-MM-DD) en hora de Colombia, sin el desfase de UTC
const obtenerHoyColombia = () =>
    new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Bogota"
    });


export const crearEntregaInforme = async (
    entregaInformeRepository,
    practicaRequisitoDocumentoRepository,
    archivoRepository,
    user_id,
    data,
    file
) => {

    const transaction =
        await sequelize.transaction();

    let publicId = null;

    try {

        // ============================================================
        // VALIDAR ARCHIVO
        // ============================================================

        if (!file) {

            throw new BadRequestError(
                "Debe adjuntar el archivo del informe."
            );

        }


        // ============================================================
        // BUSCAR LA PRÁCTICA DEL PRACTICANTE
        // ============================================================

        const practicaPracticante =
            await entregaInformeRepository.findPracticaPracticanteByUserId(
                user_id
            );

        if (!practicaPracticante) {

            throw new NotFoundError(
                "El practicante no tiene una práctica activa."
            );

        }


        // ============================================================
        // VALIDAR QUE LA PRÁCTICA ESTÉ EN CURSO
        // ============================================================

        if (
            practicaPracticante.estado !==
            "En curso"
        ) {

            throw new BadRequestError(
                "La práctica no está disponible para realizar entregas."
            );

        }


        // ============================================================
        // BUSCAR EL REQUISITO DOCUMENTO
        // ============================================================

        const practicaRequisitoDocumento =
            await practicaRequisitoDocumentoRepository.findById(
                data.practica_requisito_documento_id
            );

        if (!practicaRequisitoDocumento) {

            throw new NotFoundError(
                "El requisito de documento no existe."
            );

        }


        // ============================================================
        // VALIDAR QUE EL REQUISITO PERTENEZCA A LA PRÁCTICA
        // ============================================================

        if (
            practicaRequisitoDocumento.practica_id !==
            practicaPracticante.practica_id
        ) {

            throw new BadRequestError(
                "El requisito de documento no pertenece a la práctica del practicante."
            );

        }


        // ============================================================
        // VALIDAR QUE EL REQUISITO ESTÉ ACTIVO
        // ============================================================

        if (!practicaRequisitoDocumento.estado) {

            throw new BadRequestError(
                "El requisito de documento no está disponible para recibir entregas."
            );

        }


        // ============================================================
        // VALIDAR FECHAS DEL REQUISITO
        // ============================================================

        const hoy = obtenerHoyColombia();

        if (
            practicaRequisitoDocumento.fecha_inicio &&
            hoy < practicaRequisitoDocumento.fecha_inicio
        ) {

            throw new BadRequestError(
                "El periodo para realizar la entrega todavía no ha comenzado."
            );

        }

        if (
            practicaRequisitoDocumento.fecha_limite &&
            hoy > practicaRequisitoDocumento.fecha_limite
        ) {

            throw new BadRequestError(
                "La fecha límite para realizar la entrega ya ha vencido."
            );

        }


        // ============================================================
        // VALIDAR OBJETIVO (solo plan de trabajo)
        // ============================================================

        const esPlanDeTrabajo = esPlanDeTrabajoNombre(
            practicaRequisitoDocumento.tipoRequisitoDocumento?.nombre
        );

        const objetivo = String(data.objetivo || "").trim();

        if (esPlanDeTrabajo && !objetivo) {

            throw new BadRequestError(
                "Debe escribir el objetivo de la práctica."
            );

        }


        // ============================================================
        // BUSCAR ÚLTIMA VERSIÓN
        // ============================================================

        const ultimaEntrega =
            await entregaInformeRepository.findLatestVersion(
                practicaPracticante.id,
                data.practica_requisito_documento_id,
                transaction
            );

        let version = 1;

        if (ultimaEntrega) {

            version =
                ultimaEntrega.version + 1;

        }


        // ============================================================
        // CREAR NOMBRE DEL ARCHIVO
        // ============================================================

        const extension =
            path.extname(file.originalname);

        const nombreArchivo =
            `INFORME_${data.practica_requisito_documento_id}_${practicaPracticante.id}_V${version}_${Date.now()}${extension}`;


        // ============================================================
        // SUBIR ARCHIVO
        // ============================================================

        const resultado =
            await uploadArchivo(
                file.buffer,
                "SISPRAC/Informes/Entregas",
                nombreArchivo,
                file.mimetype
            );

        publicId =
            resultado.public_id;


        // ============================================================
        // CREAR REGISTRO DEL ARCHIVO
        // ============================================================

        const archivo =
            await archivoRepository.create(
                {
                    nombre: file.originalname,
                    url: resultado.url,
                    public_id: resultado.public_id,
                    resource_type: resultado.resource_type
                },
                transaction
            );


        // ============================================================
        // CREAR ENTREGA
        // ============================================================

        const entrega =
            await entregaInformeRepository.create(
                {
                    practica_requisito_documento_id:
                        data.practica_requisito_documento_id,

                    practica_practicante_id:
                        practicaPracticante.id,

                    archivo_id:
                        archivo.id,

                    version,

                    estado_tutor_docente:
                        "PENDIENTE",

                    estado_tutor_empresarial:
                        "PENDIENTE"

                },
                transaction
            );


        // ============================================================
        // GUARDAR OBJETIVO EN PRACTICA_PRACTICANTE
        // ============================================================

        if (esPlanDeTrabajo) {

            await entregaInformeRepository.updateObjetivoPracticaPracticante(
                practicaPracticante.id,
                objetivo,
                transaction
            );

        }


        // ============================================================
        // CONFIRMAR TRANSACCIÓN
        // ============================================================

        await transaction.commit();

        return entrega;

    } catch (error) {

        await transaction.rollback();


        // ============================================================
        // ELIMINAR ARCHIVO SI FALLÓ LA TRANSACCIÓN
        // ============================================================

        if (publicId) {

            try {

                await deleteArchivo(
                    publicId
                );

            } catch (e) {

                console.error(
                    "No se pudo eliminar el archivo nuevo de Supabase:",
                    e.message
                );

            }

        }


        // ============================================================
        // ERRORES CONTROLADOS
        // ============================================================

        if (
            error instanceof NotFoundError ||
            error instanceof BadRequestError ||
            error instanceof ConflictError
        ) {

            throw error;

        }


        throw new BadRequestError(
            error.message ||
            "No se pudo crear la entrega del informe."
        );

    }

};