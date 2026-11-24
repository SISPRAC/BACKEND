
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import {
    uploadArchivo,
    deleteArchivo,
    rutas
} from "../../../infraestructura/external/storageService.js";
import { PracticanteRepository } from "../../../infraestructura/repositorios/practicanteRepositoryImpl.js";

import { notificarPracticaRequisitoDocumentoSubido } from "../notificarEmail/notificarPracticaRequisitoDocumentoSubido.js";


// Carpeta del practicante dueño del documento: practicantes/{codigo}/requisitos
const carpetaDelPracticante = async (usuario_id) => {
    const practicante =
        await PracticanteRepository.findByUsuarioId(usuario_id);

    return rutas.practicante(
        practicante?.candidato?.codigo ?? `usuario-${usuario_id}`,
        "requisitos"
    );
};

export const subirPracticaRequisitoDocumento = async (
    sequelize,
    practicaRequisitoDocumentoSubidoRepository,
    archivoRepository,
    data,
    notificacionRepository
) => {

    const {
        usuario_id,
        practica_requisito_documento_id,
        fecha_vencimiento,
        buffer,
        nombreArchivo,
        mimeType
    } = data;


    // =========================================================
    // VALIDAR USUARIO
    // =========================================================

    if (!usuario_id) {
        throw new BadRequestError(
            "El usuario es obligatorio"
        );
    }


    // =========================================================
    // VALIDAR REQUISITO
    // =========================================================

    if (
        !practica_requisito_documento_id ||
        !Number.isInteger(Number(practica_requisito_documento_id)) ||
        Number(practica_requisito_documento_id) <= 0
    ) {
        throw new BadRequestError(
            "El identificador del requisito no es válido"
        );
    }


    // =========================================================
    // VALIDAR ARCHIVO ANTES DE SUBIRLO
    // =========================================================

    if (
        !buffer ||
        !nombreArchivo ||
        !mimeType
    ) {
        throw new BadRequestError(
            "Debes adjuntar un archivo"
        );
    }


    // =========================================================
    // VALIDAR FECHA DE VENCIMIENTO
    // =========================================================

    let fechaVencimientoValidada = null;

    if (fecha_vencimiento) {

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha_vencimiento)
        ) {
            throw new BadRequestError(
                "La fecha de vencimiento debe tener el formato YYYY-MM-DD"
            );
        }

        const fecha = new Date(
            `${fecha_vencimiento}T00:00:00.000Z`
        );

        if (
            Number.isNaN(fecha.getTime()) ||
            fecha.toISOString().slice(0, 10) !== fecha_vencimiento
        ) {
            throw new BadRequestError(
                "La fecha de vencimiento no es válida"
            );
        }

        const hoy = new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "America/Bogota",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).format(new Date());

        if (fecha_vencimiento < hoy) {
            throw new BadRequestError(
                "La fecha de vencimiento no puede ser anterior a hoy"
            );
        }

        fechaVencimientoValidada = fecha_vencimiento;
    }


    // =========================================================
    // INICIAR TRANSACCIÓN
    // =========================================================

    const transaction = await sequelize.transaction();

    let archivoSubido = null;
    let documento;

    try {

        // =====================================================
        // SUBIR ARCHIVO A SUPABASE
        // =====================================================

        archivoSubido = await uploadArchivo(
            buffer,
            await carpetaDelPracticante(usuario_id),
            nombreArchivo,
            mimeType
        );


        // =====================================================
        // REGISTRAR ARCHIVO EN LA BASE DE DATOS
        // =====================================================

        const nuevoArchivo = await archivoRepository.create(
            {
                nombre: nombreArchivo,
                url: archivoSubido.url,
                public_id: archivoSubido.public_id,
                resource_type: archivoSubido.resource_type
            },
            transaction
        );


        // =====================================================
        // REGISTRAR DOCUMENTO DEL REQUISITO
        // =====================================================

        documento =
            await practicaRequisitoDocumentoSubidoRepository.create(
                {
                    usuario_id,
                    practica_requisito_documento_id:
                        Number(practica_requisito_documento_id),
                    archivo_id: nuevoArchivo.id,
                    estado: "PENDIENTE",
                    fecha_vencimiento: fechaVencimientoValidada
                },
                transaction
            );


        // =====================================================
        // CONFIRMAR TRANSACCIÓN
        // =====================================================

        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }


        // =====================================================
        // ELIMINAR ARCHIVO DE SUPABASE SI FALLÓ LA OPERACIÓN
        // =====================================================

        if (archivoSubido?.public_id) {

            try {

                await deleteArchivo(
                    archivoSubido.public_id
                );

            } catch (errorStorage) {

                console.error(
                    "No se pudo eliminar el archivo de Supabase tras el error:",
                    errorStorage
                );
            }
        }

        throw error;
    }


    // =========================================================
    // NOTIFICAR AL TUTOR DOCENTE (FUERA DE LA TRANSACCIÓN)
    // =========================================================

    try {

        const documentoCompleto =
            await practicaRequisitoDocumentoSubidoRepository
                .findByIdParaNotificacion(documento.id);

        await notificarPracticaRequisitoDocumentoSubido({
            documento: documentoCompleto,
            practicaRequisitoDocumentoSubidoRepository,
            notificacionRepository
        });

    } catch (error) {

        console.error(
            "Error notificando la subida del documento del requisito:",
            error
        );
    }

    return documento;
};
