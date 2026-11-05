import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const actualizarPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    id,
    data
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const requisito =
            await practicaRequisitoDocumentoRepository.findById(id);

        if (!requisito) {

            throw new NotFoundError(
                "El requisito documental de la práctica no existe."
            );

        }

        const actualizado =
            await practicaRequisitoDocumentoRepository.update(
                id,
                data,
                transaction
            );

        await transaction.commit();

        return actualizado;

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
            "No se pudo actualizar el requisito documental."
        );

    }

};