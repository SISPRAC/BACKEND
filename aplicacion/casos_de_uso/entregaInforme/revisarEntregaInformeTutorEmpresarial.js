import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const revisarEntregaInformeTutorEmpresarial = async (
    entregaInformeRepository,
    id,
    tutor_empresarial_id,
    estado_tutor_empresarial,
    observacion_tutor_empresarial
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const entrega =
            await entregaInformeRepository.findById(id);

        if (!entrega) {

            throw new NotFoundError(
                "La entrega del informe no existe."
            );

        }

        if (
            estado_tutor_empresarial !== "APROBADO" &&
            estado_tutor_empresarial !== "RECHAZADO" 
        ) {

            throw new BadRequestError(
                "El estado de revisión no es válido."
            );

        }

        if (
            entrega.estado_tutor_empresarial === "APROBADO" ||
            entrega.estado_tutor_empresarial === "RECHAZADO"
        ) {

            throw new BadRequestError(
                "Esta entrega ya fue revisada por el tutor empresarial."
            );

        }

        if (
            estado_tutor_empresarial === "RECHAZADO" &&
            !observacion_tutor_empresarial?.trim()
        ) {

            throw new BadRequestError(
                "Debe indicar una observación al rechazar el informe."
            );

        }

        const actualizado =
            await entregaInformeRepository.update(
                id,
                {
                    estado_tutor_empresarial,

                    tutor_empresarial_id,

                    fecha_revision_tutor_empresarial:
                        new Date(),

                    observacion_tutor_empresarial:
                        observacion_tutor_empresarial?.trim() || null
                },
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
            "No se pudo registrar la revisión del tutor empresarial."
        );

    }
};