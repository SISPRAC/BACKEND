import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { eliminarArchivoSiNoTieneReferencias } from "../archivo/eliminarArchivoSiNoTieneReferencias.js";

export const eliminarTipoRequisitoDocumento = async (
    tipoRequisitoDocumentoRepository,
    archivoRepository,
    id
) => {

    const transaction =
        await sequelize.transaction();

    let archivoId = null;

    try {

        const tipo =
            await tipoRequisitoDocumentoRepository.findById(id);

        if (!tipo) {

            throw new NotFoundError(
                "El tipo de requisito documental no existe."
            );

        }

        archivoId =
            tipo.archivo_id;

        await tipoRequisitoDocumentoRepository.delete(
            id,
            transaction
        );

        await transaction.commit();

        /*
         * El TipoRequisitoDocumento ya fue eliminado.
         *
         * Ahora comprobamos si el archivo todavía
         * tiene otras referencias.
         */
        if (archivoId) {

            try {

                await eliminarArchivoSiNoTieneReferencias(
                    archivoRepository,
                    archivoId
                );

            } catch (e) {

                console.error(
                    "No se pudo limpiar el archivo asociado:",
                    e.message
                );

            }

        }

        return {
            message:
                "Tipo de requisito documental eliminado correctamente."
        };

    } catch (error) {

        await transaction.rollback();

        if (
            error instanceof NotFoundError ||
            error instanceof BadRequestError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message ||
            "No se pudo eliminar el tipo de requisito documental."
        );

    }

};