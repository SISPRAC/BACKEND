
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { notificarRevisionInformeTutorEmpresarial } from "../notificarEmail/notificarRevisionInformeTutorEmpresarial.js";

export const revisarEntregaInformeTutorEmpresarial = async (
    id,
    user_id_tutorEmpresarial,
    estado_tutor_empresarial,
    observacion_tutor_empresarial,
    {
        entregaInformeRepository,
        tutorEmpresaRepository,
        notificacionRepository
    }
) => {

    const transaction = await sequelize.transaction();

    let actualizado ;

    const observacion =
        observacion_tutor_empresarial?.trim() || null;

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
            !observacion
        ) {
            throw new BadRequestError(
                "Debe indicar una observación al rechazar el informe."
            );
        }

        // Obtener el tutor empresarial mediante el ID del usuario
        const tutorEmpresa =
            await tutorEmpresaRepository.findByUserId(
                user_id_tutorEmpresarial
            );

        if (!tutorEmpresa) {
            throw new NotFoundError(
                "No se encontró el tutor empresarial asociado al usuario."
            );
        }

        actualizado =
            await entregaInformeRepository.update(
                id,
                {
                    estado_tutor_empresarial,

                    tutor_empresarial_id: tutorEmpresa.id,

                    fecha_revision_tutor_empresarial: new Date(),

                    observacion_tutor_empresarial: observacion
                },
                transaction
            );

        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

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

    // ============================================================
    // NOTIFICAR (fuera de la transacción)
    // ============================================================

    try {

        const entregaCompleta =
            await entregaInformeRepository.findByIdParaNotificacion(id);

        const nombreDocumento =
            entregaCompleta?.practicaRequisitoDocumento
                ?.tipoRequisitoDocumento
                ?.nombre;

        await notificarRevisionInformeTutorEmpresarial({
            entrega: entregaCompleta,
            nombreDocumento,
            estado: estado_tutor_empresarial,
            observacion,
            notificacionRepository
        });

    } catch (error) {

        console.error(
            "Error notificando la revisión del informe (empresarial):",
            error
        );

    }

    return actualizado;

};
