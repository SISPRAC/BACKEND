import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const revisarDocumentoConvenioEmpresa = async (
    empresaRequisitoDocumentoRepository,
    id,
    data
) => {

    const estado = data.estado;
    const observacion = data.observacion?.trim() || null;

    if (!["APROBADO", "RECHAZADO"].includes(estado)) {
        throw new BadRequestError("El estado debe ser APROBADO o RECHAZADO.");
    }

    if (estado === "RECHAZADO" && !observacion) {
        throw new BadRequestError(
            "Debes indicar el motivo del rechazo."
        );
    }

    const transaction = await sequelize.transaction();

    try {

        const doc =
            await empresaRequisitoDocumentoRepository.findById(
                Number(id),
                transaction
            );

        if (!doc) {
            throw new NotFoundError("El documento no existe.");
        }

        if (doc.estado !== "PENDIENTE") {
            throw new BadRequestError(
                "Solo se pueden revisar documentos pendientes."
            );
        }

        const actualizado =
            await empresaRequisitoDocumentoRepository.update(
                doc.id,
                { estado, observacion },
                transaction
            );

        await transaction.commit();

        return actualizado;

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (
            error instanceof BadRequestError ||
            error instanceof NotFoundError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message || "No se pudo registrar la revisión."
        );

    }

};