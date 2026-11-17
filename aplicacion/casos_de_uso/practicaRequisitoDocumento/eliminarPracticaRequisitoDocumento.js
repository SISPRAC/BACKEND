import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const eliminarPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    id
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

        const tieneEntregas =
            await practicaRequisitoDocumentoRepository.tieneEntregas(
                id,
                transaction
            );

        if (tieneEntregas) {
            throw new BadRequestError(
                "No se puede eliminar el requisito porque ya tiene entregas asociadas."
            );
        }

        const tieneSubidos =
            await practicaRequisitoDocumentoRepository.tieneDocumentosSubidos(
                id,
                transaction
            );

        if (tieneSubidos) {
            throw new BadRequestError(
                "No se puede eliminar el requisito porque ya tiene documentos subidos."
            );
        }

        await practicaRequisitoDocumentoRepository.delete(
            id,
            transaction
        );

        await transaction.commit();

        return {
            message: "Requisito documental eliminado correctamente."
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
            "No se pudo eliminar el requisito documental."
        );

    }

};