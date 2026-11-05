import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const crearPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    data
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const existente =
            await practicaRequisitoDocumentoRepository.findByPracticaId(
                data.practica_id
            );

        const yaExiste =
            existente.some(
                requisito =>
                    requisito.tipo_requisito_documento_id ===
                    data.tipo_requisito_documento_id
            );

        if (yaExiste) {

            throw new ConflictError(
                "Este requisito documental ya está asignado a la práctica."
            );

        }

        const requisito =
            await practicaRequisitoDocumentoRepository.create(
                data,
                transaction
            );

        await transaction.commit();

        return requisito;

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
            "No se pudo asignar el requisito documental a la práctica."
        );

    }

};