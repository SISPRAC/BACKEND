import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const revisarEntregaInformeTutorDocente = async (
    entregaInformeRepository,
    id,
    tutor_docente_id,
    estado_tutor_docente,
    observacion_tutor_docente
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
            estado_tutor_docente !== "APROBADO" &&
            estado_tutor_docente !== "RECHAZADO"
        ) {

            throw new BadRequestError(
                "El estado de revisión no es válido."
            );

        }

        /*
         * Una versión histórica no debe volver
         * a modificarse después de una decisión.
         */
        if (
            entrega.estado_tutor_docente === "APROBADO" ||
            entrega.estado_tutor_docente === "RECHAZADO"
        ) {

            throw new BadRequestError(
                "Esta entrega ya fue revisada por el tutor docente."
            );

        }

        /*
         * Si rechaza, debe existir una observación.
         */
        if (
            estado_tutor_docente === "RECHAZADO" &&
            !observacion_tutor_docente?.trim()
        ) {

            throw new BadRequestError(
                "Debe indicar una observación al rechazar el informe."
            );

        }

        const actualizado =
            await entregaInformeRepository.update(
                id,
                {
                    estado_tutor_docente,

                    tutor_docente_id,

                    fecha_revision_tutor_docente:
                        new Date(),

                    observacion_tutor_docente:
                        observacion_tutor_docente || null

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
            "No se pudo registrar la revisión del tutor docente."
        );

    }

};