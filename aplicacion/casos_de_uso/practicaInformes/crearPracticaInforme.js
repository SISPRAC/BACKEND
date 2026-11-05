import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const crearPracticaInforme = async (
    practicaInformeRepository,
    data
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const existentes =
            await practicaInformeRepository.findByPracticaId(
                data.practica_id
            );

        const yaExiste =
            existentes.some(
                informe =>
                    informe.tipo_informe_id ===
                    data.tipo_informe_id
            );

        if (yaExiste) {

            throw new ConflictError(
                "Este tipo de informe ya está asignado a la práctica."
            );

        }

        const informe =
            await practicaInformeRepository.create(
                data,
                transaction
            );

        await transaction.commit();

        return informe;

    } catch (error) {

        await transaction.rollback();

        if (
            error instanceof ConflictError ||
            error instanceof BadRequestError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message ||
            "No se pudo asignar el informe a la práctica."
        );

    }

};