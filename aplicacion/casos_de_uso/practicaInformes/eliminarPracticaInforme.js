import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const eliminarPracticaInforme = async (
    practicaInformeRepository,
    id
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

        await practicaInformeRepository.delete(
            id,
            transaction
        );

        await transaction.commit();

        return {
            message:
                "Informe de la práctica eliminado correctamente."
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
            "No se pudo eliminar el informe de la práctica."
        );

    }

};