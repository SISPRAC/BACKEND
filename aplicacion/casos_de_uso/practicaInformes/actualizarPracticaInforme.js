import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const actualizarPracticaInforme = async (
    practicaInformeRepository,
    id,
    data
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const informe =
            await practicaInformeRepository.findById(id);

        if (!informe) {

            throw new NotFoundError(
                "El informe de la práctica no existe."
            );

        }

        const actualizado =
            await practicaInformeRepository.update(
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
            "No se pudo actualizar el informe de la práctica."
        );

    }

};