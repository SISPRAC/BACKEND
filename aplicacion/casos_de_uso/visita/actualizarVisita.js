import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";


export const actualizarVisita = async (
    sequelize,
    visitaRepository,
    visitaArchivoRepository,
    archivoRepository,
    tutorDocenteRepository,
    data
) => {

    const transaction =
        await sequelize.transaction();


    // Archivos físicos que deben eliminarse
    // solamente después del commit.
    const archivosParaEliminar = [];


    try {

        const {
            visita_id,
            usuario_id,
            fecha_realizada,
            descripcion,
            fotos = [],
            acta
        } = data;


        // =========================================================
        // VALIDAR VISITA
        // =========================================================

        if (!visita_id) {

            throw new BadRequestError(
                "La visita es obligatoria"
            );

        }


        const visita =
            await visitaRepository.findByIdWithSolicitud(
                visita_id
            );


        if (!visita) {

            throw new NotFoundError(
                "La visita no existe"
            );

        }


        // =========================================================
        // VALIDAR USUARIO
        // =========================================================

        if (!usuario_id) {

            throw new BadRequestError(
                "El usuario es obligatorio"
            );

        }


        // =========================================================
        // OBTENER TUTOR DOCENTE
        // =========================================================

        const tutorDocente =
            await tutorDocenteRepository.findByUserId(
                usuario_id
            );


        if (!tutorDocente) {

            throw new NotFoundError(
                "No se encontró el tutor docente asociado al usuario"
            );

        }


        // =========================================================
        // OBTENER SOLICITUD ASOCIADA
        // =========================================================

        const solicitudVisita =
            visita.solicitud;


        if (!solicitudVisita) {

            throw new NotFoundError(
                "No se encontró la solicitud asociada a la visita"
            );

        }


        // =========================================================
        // VALIDAR QUE LA VISITA PERTENEZCA AL TUTOR DOCENTE
        // =========================================================

        if (
            solicitudVisita.tutor_docente_id !==
            tutorDocente.id
        ) {

            throw new BadRequestError(
                "No tienes permiso para actualizar esta visita"
            );

        }


        // =========================================================
        // VALIDAR FECHA REALIZADA
        // =========================================================

        if (fecha_realizada) {

            const fecha =
                new Date(
                    `${fecha_realizada}T00:00:00`
                );


            if (
                Number.isNaN(
                    fecha.getTime()
                )
            ) {

                throw new BadRequestError(
                    "La fecha realizada no es válida"
                );

            }

        }


        // =========================================================
        // OBTENER ARCHIVOS ACTUALES DE LA VISITA
        // =========================================================

        const archivosActuales =
            await visitaArchivoRepository.findByVisitaId(
                visita_id
            );


        const fotografiasActuales =
            archivosActuales.filter(
                (archivo) =>
                    archivo.tipo === "Fotografia"
            );


        const actaActual =
            archivosActuales.find(
                (archivo) =>
                    archivo.tipo === "Acta"
            );


        // =========================================================
        // VALIDAR FOTOGRAFÍAS RECIBIDAS
        // =========================================================

        if (
            !Array.isArray(fotos)
        ) {

            throw new BadRequestError(
                "Las fotografías no tienen un formato válido"
            );

        }


        // =========================================================
        // IDENTIFICAR REEMPLAZOS Y NUEVAS FOTOGRAFÍAS
        // =========================================================

        const reemplazos =
            fotos.filter(
                (foto) =>
                    foto.reemplazar_visita_archivo_id
            );


        const nuevas =
            fotos.filter(
                (foto) =>
                    !foto.reemplazar_visita_archivo_id
            );


        // =========================================================
        // OBTENER IDS DE FOTOGRAFÍAS A REEMPLAZAR
        // =========================================================

        const idsReemplazo =
            reemplazos.map(
                (foto) =>
                    Number(
                        foto.reemplazar_visita_archivo_id
                    )
            );


        // =========================================================
        // EVITAR REEMPLAZAR DOS VECES LA MISMA FOTO
        // =========================================================

        const idsUnicos =
            new Set(
                idsReemplazo
            );


        if (
            idsUnicos.size !==
            idsReemplazo.length
        ) {

            throw new BadRequestError(
                "No puedes reemplazar la misma fotografía más de una vez"
            );

        }


        // =========================================================
        // VALIDAR QUE LAS FOTOGRAFÍAS A REEMPLAZAR
        // PERTENEZCAN A LA VISITA
        // =========================================================

        for (
            const id
            of idsReemplazo
        ) {

            const fotografia =
                fotografiasActuales.find(
                    (archivo) =>
                        archivo.id === id
                );


            if (!fotografia) {

                throw new NotFoundError(
                    "Una de las fotografías a reemplazar no existe o no pertenece a la visita"
                );

            }

        }


        // =========================================================
        // CALCULAR TOTAL FINAL DE FOTOGRAFÍAS
        // =========================================================

        const totalFotografias =
            fotografiasActuales.length -
            reemplazos.length +
            nuevas.length;


        if (
            totalFotografias > 3
        ) {

            throw new BadRequestError(
                "La visita no puede tener más de 3 fotografías"
            );

        }


        // =========================================================
        // VALIDAR CADA FOTOGRAFÍA
        // =========================================================

        for (
            const foto
            of fotos
        ) {

            if (!foto) {

                throw new BadRequestError(
                    "Se recibió una fotografía inválida"
                );

            }


            if (
                !foto.mimetype ||
                !foto.mimetype.startsWith(
                    "image/"
                )
            ) {

                throw new BadRequestError(
                    "Solo se permiten imágenes para las fotografías"
                );

            }


            if (!foto.buffer) {

                throw new BadRequestError(
                    "Una de las fotografías no contiene información válida"
                );

            }

        }


        // =========================================================
        // VALIDAR ACTA
        // =========================================================

        if (acta) {

            if (
                acta.mimetype !==
                "application/pdf"
            ) {

                throw new BadRequestError(
                    "El acta debe ser un archivo PDF"
                );

            }


            if (!acta.buffer) {

                throw new BadRequestError(
                    "El acta no contiene información válida"
                );

            }

        }


        // =========================================================
        // ACTUALIZAR INFORMACIÓN DE LA VISITA
        // =========================================================


        const datosActualizacion = {
            fecha_realizada: new Date(),

            ...(descripcion !== undefined && {
                descripcion
            })
        };

        await visitaRepository.update(
            visita_id,
            datosActualizacion,
            transaction
        );


        // =========================================================
        // PROCESAR FOTOGRAFÍAS
        // =========================================================

        for (
            const foto
            of fotos
        ) {

            // =====================================================
            // DETERMINAR SI ES REEMPLAZO
            // =====================================================

            const reemplazarId =
                foto.reemplazar_visita_archivo_id
                    ? Number(
                        foto.reemplazar_visita_archivo_id
                    )
                    : null;


            let visitaArchivo =
                null;


            let archivoAnterior =
                null;


            // =====================================================
            // OBTENER FOTOGRAFÍA A REEMPLAZAR
            // =====================================================

            if (reemplazarId) {

                visitaArchivo =
                    fotografiasActuales.find(
                        (archivo) =>
                            archivo.id ===
                            reemplazarId
                    );


                if (!visitaArchivo) {

                    throw new NotFoundError(
                        "La fotografía que intentas reemplazar no existe o no pertenece a la visita"
                    );

                }


                archivoAnterior =
                    await archivoRepository.findById(
                        visitaArchivo.archivo_id
                    );


                if (!archivoAnterior) {

                    throw new NotFoundError(
                        "No se encontró el archivo asociado a la fotografía"
                    );

                }

            }


            // =====================================================
            // SUBIR NUEVA FOTOGRAFÍA
            // =====================================================

            const archivoSubido =
                await uploadArchivo(
                    foto.buffer,
                    `visitas/${visita_id}/fotografias`,
                    foto.originalname,
                    foto.mimetype
                );


            // =====================================================
            // CREAR REGISTRO DEL NUEVO ARCHIVO
            // =====================================================

            const nuevoArchivo =
                await archivoRepository.create(
                    {
                        nombre:
                            foto.originalname,

                        url:
                            archivoSubido.url,

                        public_id:
                            archivoSubido.public_id,

                        resource_type:
                            archivoSubido.resource_type

                    },
                    transaction
                );


            // =====================================================
            // REEMPLAZAR FOTOGRAFÍA EXISTENTE
            // =====================================================

            if (visitaArchivo) {

                await visitaArchivoRepository.update(
                    visitaArchivo.id,
                    {
                        archivo_id:
                            nuevoArchivo.id
                    },
                    transaction
                );


                if (
                    archivoAnterior?.public_id
                ) {

                    archivosParaEliminar.push({

                        id:
                            archivoAnterior.id,

                        public_id:
                            archivoAnterior.public_id

                    });

                }

                else if (
                    archivoAnterior
                ) {

                    await archivoRepository.delete(
                        archivoAnterior.id,
                        transaction
                    );

                }

            }


            // =====================================================
            // AGREGAR NUEVA FOTOGRAFÍA
            // =====================================================

            else {

                await visitaArchivoRepository.create(
                    {
                        visita_id,

                        archivo_id:
                            nuevoArchivo.id,

                        tipo:
                            "Fotografia"

                    },
                    transaction
                );

            }

        }


        // =========================================================
        // REEMPLAZAR / CREAR ACTA
        // =========================================================

        if (acta) {

            // -----------------------------------------------------
            // SUBIR NUEVA ACTA
            // -----------------------------------------------------

            const archivoSubido =
                await uploadArchivo(
                    acta.buffer,
                    `visitas/${visita_id}/acta`,
                    acta.originalname,
                    acta.mimetype
                );


            // -----------------------------------------------------
            // CREAR REGISTRO DEL NUEVO ARCHIVO
            // -----------------------------------------------------

            const nuevoArchivo =
                await archivoRepository.create(
                    {
                        nombre:
                            acta.originalname,

                        url:
                            archivoSubido.url,

                        public_id:
                            archivoSubido.public_id,

                        resource_type:
                            archivoSubido.resource_type

                    },
                    transaction
                );


            // -----------------------------------------------------
            // REEMPLAZAR ACTA EXISTENTE
            // -----------------------------------------------------

            if (actaActual) {

                const archivoAnterior =
                    await archivoRepository.findById(
                        actaActual.archivo_id
                    );


                await visitaArchivoRepository.update(
                    actaActual.id,
                    {
                        archivo_id:
                            nuevoArchivo.id
                    },
                    transaction
                );


                if (
                    archivoAnterior?.public_id
                ) {

                    archivosParaEliminar.push({

                        id:
                            archivoAnterior.id,

                        public_id:
                            archivoAnterior.public_id

                    });

                }

                else if (
                    archivoAnterior
                ) {

                    await archivoRepository.delete(
                        archivoAnterior.id,
                        transaction
                    );

                }

            }


            // -----------------------------------------------------
            // CREAR ACTA SI NO EXISTE
            // -----------------------------------------------------

            else {

                await visitaArchivoRepository.create(
                    {
                        visita_id,

                        archivo_id:
                            nuevoArchivo.id,

                        tipo:
                            "Acta"

                    },
                    transaction
                );

            }

        }


        // =========================================================
        // COMMIT
        // =========================================================

        await transaction.commit();


        // =========================================================
        // ELIMINAR ARCHIVOS ANTERIORES DE SUPABASE
        // =========================================================

        for (
            const archivo
            of archivosParaEliminar
        ) {

            try {

                await deleteArchivo(
                    archivo.public_id
                );


                await archivoRepository.delete(
                    archivo.id
                );

            } catch (error) {

                console.error(
                    "No se pudo eliminar el archivo anterior:",
                    error
                );

            }

        }


        // =========================================================
        // RESPUESTA
        // =========================================================

        return await visitaRepository.findById(
            visita_id
        );


    } catch (error) {

        await transaction.rollback();

        throw error;

    }

};