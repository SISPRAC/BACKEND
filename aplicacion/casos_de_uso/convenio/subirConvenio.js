import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { registrarHistorialConvenio } from "../historialConvenio/registrarHistorial.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";


export const subirConvenio = async (
    sequelize,
    convenioRepository,
    archivoRepository,
    historialConvenioRepository,
    data
) => {

    const transaction = await sequelize.transaction();

    try {

        const {
            convenio_id,
            modo,
            empresa_id,
            fecha_inicio,
            fecha_fin,
            usuario_id,
            buffer,
            nombreArchivo,
            mimeType,
            carpeta
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
        // VALIDAR MODO
        // =========================================================

        if (
            modo !== "EDITAR" &&
            modo !== "NUEVO"
        ) {

            throw new BadRequestError(
                "El modo de operación es obligatorio"
            );
        }


        // =========================================================
        // VALIDAR ARCHIVO
        //
        // NUEVO:
        // El archivo siempre es obligatorio.
        //
        // EDITAR:
        // El archivo es opcional porque se pueden modificar
        // solamente las fechas.
        // =========================================================

        if (modo === "NUEVO") {

            if (
                !buffer ||
                !nombreArchivo ||
                !mimeType
            ) {

                throw new BadRequestError(
                    "El archivo es obligatorio para crear un nuevo convenio"
                );
            }
        }


        // =========================================================
        // VALIDAR FECHAS
        // =========================================================

        if (
            fecha_inicio &&
            fecha_fin &&
            fecha_fin < fecha_inicio
        ) {

            throw new BadRequestError(
                "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }


        // =========================================================
        // FECHA DE ENVÍO
        // =========================================================

        const fecha_envio =
            new Intl.DateTimeFormat(
                "en-CA",
                {
                    timeZone: "America/Bogota",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }
            ).format(new Date());


        // =========================================================
        // VARIABLES
        // =========================================================

        let convenioExistente = null;
        let archivoAnterior = null;
        let nuevoArchivo = null;
        let convenio = null;
        let accion = null;
        let comentarioHistorial = null;


        // =========================================================
        // EDITAR
        // =========================================================

        if (modo === "EDITAR") {

            if (!convenio_id) {

                throw new BadRequestError(
                    "El convenio es obligatorio para editar"
                );
            }


            convenioExistente =
                await convenioRepository.findById(
                    convenio_id
                );


            if (!convenioExistente) {

                throw new NotFoundError(
                    "El convenio no existe"
                );
            }


            // -----------------------------------------------------
            // NO PERMITIR EDITAR APROBADO
            // -----------------------------------------------------

            if (
                convenioExistente.estado === "APROBADO"
            ) {

                throw new BadRequestError(
                    "No puedes modificar un convenio aprobado"
                );
            }


            // -----------------------------------------------------
            // NO PERMITIR EDITAR VENCIDO
            // -----------------------------------------------------

            if (
                convenioExistente.estado === "VENCIDO"
            ) {

                throw new BadRequestError(
                    "No puedes modificar un convenio vencido. Debes crear un nuevo convenio"
                );
            }


            // -----------------------------------------------------
            // ARCHIVO ANTERIOR
            // -----------------------------------------------------

            archivoAnterior =
                await archivoRepository.findById(
                    convenioExistente.archivo_id
                );


            // -----------------------------------------------------
            // SUBIR NUEVO ARCHIVO SOLO SI LLEGÓ
            // -----------------------------------------------------

            if (
                buffer &&
                nombreArchivo &&
                mimeType
            ) {

                const archivoSubido =
                    await uploadArchivo(
                        buffer,
                        carpeta,
                        nombreArchivo,
                        mimeType
                    );


                nuevoArchivo =
                    await archivoRepository.create(
                        {
                            nombre: nombreArchivo,
                            url: archivoSubido.url,
                            public_id:
                                archivoSubido.public_id,
                            resource_type:
                                archivoSubido.resource_type
                        },
                        transaction
                    );
            }


            // -----------------------------------------------------
            // DATOS A ACTUALIZAR
            // -----------------------------------------------------

            const datosActualizacion = {

                estado: "PENDIENTE",

                fecha_envio,

                ...(fecha_inicio && {
                    fecha_inicio
                }),

                ...(fecha_fin && {
                    fecha_fin
                })
            };


            // -----------------------------------------------------
            // SI HAY NUEVO ARCHIVO,
            // REEMPLAZAR ARCHIVO DEL CONVENIO
            // -----------------------------------------------------

            if (nuevoArchivo) {

                datosActualizacion.archivo_id =
                    nuevoArchivo.id;
            }


            await convenioRepository.update(
                convenio_id,
                datosActualizacion,
                transaction
            );


            convenio =
                await convenioRepository.findById(
                    convenio_id
                );


            accion = "ACTUALIZADO";


            comentarioHistorial =
                nuevoArchivo
                    ? "Convenio actualizado, archivo reemplazado y reenviado a revisión"
                    : "Convenio actualizado y reenviado a revisión";
        }


        // =========================================================
        // CREAR NUEVO CONVENIO
        // =========================================================

        if (modo === "NUEVO") {

            if (!empresa_id) {

                throw new BadRequestError(
                    "La empresa es obligatoria para crear un nuevo convenio"
                );
            }


            if (
                !fecha_inicio ||
                !fecha_fin
            ) {

                throw new BadRequestError(
                    "La fecha de inicio y la fecha de fin son obligatorias"
                );
            }


            // -----------------------------------------------------
            // BUSCAR EL CONVENIO ACTUAL DE LA EMPRESA
            // -----------------------------------------------------

            const convenios =
                await convenioRepository.findAllByEmpresaId(
                    empresa_id
                );


            // -----------------------------------------------------
            // BUSCAR CONVENIO APROBADO
            // -----------------------------------------------------

            const convenioAprobado =
                convenios.find(
                    (convenio) =>
                        convenio.estado === "APROBADO"
                );


            // -----------------------------------------------------
            // SI EXISTE UN CONVENIO APROBADO,
            // VALIDAR LOS 7 DÍAS
            // -----------------------------------------------------

            if (convenioAprobado) {

                const ahora =
                    new Date();


                const fechaFin =
                    new Date(
                        `${convenioAprobado.fecha_fin}T00:00:00-05:00`
                    );


                const diferenciaMs =
                    fechaFin.getTime() -
                    ahora.getTime();


                const diasRestantes =
                    Math.ceil(
                        diferenciaMs /
                        (1000 * 60 * 60 * 24)
                    );


                // -------------------------------------------------
                // Si faltan más de 7 días,
                // todavía no puede crear otro.
                // -------------------------------------------------

                if (diasRestantes > 7) {

                    throw new BadRequestError(
                        `No puedes cargar un nuevo convenio todavía. El convenio actual vence en ${diasRestantes} días`
                    );
                }
            }


            // -----------------------------------------------------
            // SUBIR ARCHIVO DEL NUEVO CONVENIO
            // -----------------------------------------------------

            const archivoSubido =
                await uploadArchivo(
                    buffer,
                    carpeta,
                    nombreArchivo,
                    mimeType
                );


            nuevoArchivo =
                await archivoRepository.create(
                    {
                        nombre: nombreArchivo,
                        url: archivoSubido.url,
                        public_id:
                            archivoSubido.public_id,
                        resource_type:
                            archivoSubido.resource_type
                    },
                    transaction
                );


            // -----------------------------------------------------
            // CREAR NUEVO REGISTRO DE CONVENIO
            //
            // IMPORTANTE:
            // NO se modifica el convenio anterior.
            // -----------------------------------------------------

            convenio =
                await convenioRepository.create(
                    {
                        empresa_id,

                        archivo_id:
                            nuevoArchivo.id,

                        estado: "PENDIENTE",

                        fecha_inicio,

                        fecha_fin,

                        fecha_envio
                    },
                    transaction
                );


            accion = "CARGADO";


            comentarioHistorial =
                "Nuevo convenio cargado y enviado a revisión";
        }


        // =========================================================
        // HISTORIAL
        // =========================================================

        await registrarHistorialConvenio(
            historialConvenioRepository,
            {
                convenio_id:
                    convenio.id,

                archivo_id:
                    nuevoArchivo?.id ??
                    convenio.archivo_id,

                accion,

                comentario:
                    comentarioHistorial,

                usuario_id,

                fecha:
                    new Date()
            },
            transaction
        );


        // =========================================================
        // COMMIT
        // =========================================================

        await transaction.commit();


        // =========================================================
        // ELIMINAR ARCHIVO ANTERIOR
        //
        // SOLAMENTE:
        // - estamos EDITANDO
        // - se subió un archivo nuevo
        //
        // NUNCA cuando se crea un convenio nuevo.
        // =========================================================

        if (
            modo === "EDITAR" &&
            nuevoArchivo &&
            archivoAnterior?.public_id
        ) {

            try {

                await deleteArchivo(
                    archivoAnterior.public_id
                );


                await archivoRepository.delete(
                    archivoAnterior.id
                );

            } catch (err) {

                console.error(
                    "No se pudo eliminar el archivo anterior:",
                    err
                );
            }
        }


        // =========================================================
        // RESPUESTA
        // =========================================================

        return await convenioRepository.findById(
            convenio.id
        );


    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};