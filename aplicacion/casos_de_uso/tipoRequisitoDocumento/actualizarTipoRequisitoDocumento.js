import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { eliminarArchivoSiNoTieneReferencias } from "../archivo/eliminarArchivoSiNoTieneReferencias.js";

export const actualizarTipoRequisitoDocumento = async (
    tipoRequisitoDocumentoRepository,
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
            await tipoRequisitoDocumentoRepository.findById(id);

        if (!tipo) {

            throw new NotFoundError(
                "El tipo de requisito documental no existe."
            );

        }

        if (file) {

            archivoAnteriorId =
                tipo.archivo_id;

            const extension =
                path.extname(file.originalname);

            const nombreArchivo =
                `TIPO_REQ_DOC_${Date.now()}${extension}`;

            const resultado =
                await uploadArchivo(
                    file.buffer,
                    "SISPRAC/RequisitosDocumentales",
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
            await tipoRequisitoDocumentoRepository.update(
                id,
                data,
                transaction
            );

        await transaction.commit();

        /*
         * El cambio ya está confirmado.
         *
         * Ahora revisamos si la plantilla anterior
         * todavía tiene alguna referencia.
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
         * Si la nueva plantilla llegó a Supabase
         * pero la operación falló, eliminamos
         * solamente esa nueva plantilla.
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
            "No se pudo actualizar el tipo de requisito documental."
        );

    }

};