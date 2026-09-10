import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { eliminarArchivoSiNoTieneReferencias } from "../archivo/eliminarArchivoSiNoTieneReferencias.js";

export const actualizarTipoInforme = async (
    tipoInformeRepository,
    archivoRepository,
    id,
    data,
    file
) => {

    const transaction =
        await sequelize.transaction();

    let newPublicId = null;
    let archivoAnteriorId = null;

    try {

        const tipo =
            await tipoInformeRepository.findById(id);

        if (!tipo) {

            throw new NotFoundError(
                "El tipo de informe no existe."
            );

        }

        if (file) {

            archivoAnteriorId =
                tipo.archivo_id;

            const extension =
                path.extname(file.originalname);

            const nombreArchivo =
                `TIPO_INFORME_${Date.now()}${extension}`;

            const resultado =
                await uploadArchivo(
                    file.buffer,
                    "SISPRAC/Informes",
                    nombreArchivo,
                    file.mimetype
                );

            newPublicId =
                resultado.public_id;

            const nuevoArchivo =
                await archivoRepository.create(
                    {
                        nombre: file.originalname,
                        url: resultado.url,
                        public_id: resultado.public_id,
                        resource_type: resultado.resource_type
                    },
                    transaction
                );

            data.archivo_id =
                nuevoArchivo.id;
        }

        const actualizado =
            await tipoInformeRepository.update(
                id,
                data,
                transaction
            );

        await transaction.commit();

        /*
         * Ya se confirmó el cambio.
         * Ahora limpiamos la plantilla anterior
         * únicamente si quedó sin referencias.
         */
        if (
            archivoAnteriorId &&
            archivoAnteriorId !== data.archivo_id
        ) {

            try {

                await eliminarArchivoSiNoTieneReferencias(
                    archivoRepository,
                    archivoAnteriorId
                );

            } catch (e) {

                console.error(
                    "No se pudo limpiar la plantilla anterior:",
                    e.message
                );

            }

        }

        return actualizado;

    } catch (error) {

        await transaction.rollback();

        /*
         * Si la nueva plantilla fue subida pero
         * la operación falló, la eliminamos.
         */
        if (newPublicId) {

            try {

                await deleteArchivo(
                    newPublicId
                );

            } catch (e) {

                console.error(
                    "No se pudo eliminar el nuevo archivo de Supabase:",
                    e.message
                );

            }

        }

        if (
            error instanceof NotFoundError ||
            error instanceof BadRequestError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message ||
            "No se pudo actualizar el tipo de informe."
        );

    }

};