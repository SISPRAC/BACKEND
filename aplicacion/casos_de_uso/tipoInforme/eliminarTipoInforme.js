import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { eliminarArchivoSiNoTieneReferencias } from "../archivo/eliminarArchivoSiNoTieneReferencias.js";

export const eliminarTipoInforme = async (
    tipoInformeRepository,
    archivoRepository,
    id
) => {

    const transaction =
        await sequelize.transaction();

    let archivoId = null;

    try {

        const tipo =
            await tipoInformeRepository.findById(id);

        if (!tipo) {

            throw new NotFoundError(
                "El tipo de informe no existe."
            );

        }

        archivoId =
            tipo.archivo_id;

        await tipoInformeRepository.delete(
            id,
            transaction
        );

        await transaction.commit();

        /*
         * El TipoInforme ya fue eliminado.
         *
         * Ahora comprobamos si el archivo
         * todavía tiene otras referencias.
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
                "Tipo de informe eliminado correctamente."
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
            "No se pudo eliminar el tipo de informe."
        );

    }

};