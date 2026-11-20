import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { notificarRevisionInformeTutorDocente } from "../notificarEmail/notificarRevisionInformeTutorDocente.js";

export const revisarEntregaInformeTutorDocente = async (
    id,
    user_id,
    estado_tutor_docente,
    observacion_tutor_docente,
    {
        entregaInformeRepository,
        TutorDocenteRepository,
        notificacionRepository
    }
) => {

    const transaction = await sequelize.transaction();

    let actualizado ;
    let tutorDocente;
    const observacion = observacion_tutor_docente?.trim() || null;

    try {

        // ============================================================
        // BUSCAR TUTOR DOCENTE
        // ============================================================

        tutorDocente =
            await TutorDocenteRepository.findByUserId(user_id);

        if (!tutorDocente) {
            throw new NotFoundError(
                "No se encontró el perfil del tutor docente."
            );
        }

        // ============================================================
        // BUSCAR ENTREGA
        // ============================================================

        const entrega =
            await entregaInformeRepository.findById(id);

        if (!entrega) {
            throw new NotFoundError(
                "La entrega del informe no existe."
            );
        }

        // ============================================================
        // VALIDAR APROBACIÓN DEL TUTOR EMPRESARIAL
        // ============================================================

        if (entrega.estado_tutor_empresarial !== "APROBADO") {
            throw new BadRequestError(
                "El tutor empresarial debe aprobar primero la entrega del informe."
            );
        }

        // ============================================================
        // VALIDAR ESTADO
        // ============================================================

        if (
            estado_tutor_docente !== "APROBADO" &&
            estado_tutor_docente !== "RECHAZADO"
        ) {
            throw new BadRequestError(
                "El estado de revisión no es válido."
            );
        }

        // ============================================================
        // VALIDAR QUE NO HAYA SIDO REVISADA
        // ============================================================

        if (
            entrega.estado_tutor_docente === "APROBADO" ||
            entrega.estado_tutor_docente === "RECHAZADO"
        ) {
            throw new BadRequestError(
                "Esta entrega ya fue revisada por el tutor docente."
            );
        }

        // ============================================================
        // OBSERVACIÓN OBLIGATORIA SI RECHAZA
        // ============================================================

        if (
            estado_tutor_docente === "RECHAZADO" &&
            !observacion
        ) {
            throw new BadRequestError(
                "Debe indicar una observación al rechazar el informe."
            );
        }

        // ============================================================
        // ACTUALIZAR ENTREGA
        // ============================================================

        actualizado =
            await entregaInformeRepository.update(
                id,
                {
                    estado_tutor_docente,

                    tutor_docente_id: tutorDocente.id,

                    fecha_revision_tutor_docente: new Date(),

                    observacion_tutor_docente: observacion
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
            "No se pudo registrar la revisión del tutor docente."
        );

    }

    // ============================================================
    // NOTIFICAR (fuera de la transacción)
    // ============================================================

    if (!notificacionRepository) {

        console.warn(
            "[revisionInforme] No se notificó: falta notificacionRepository."
        );

    } else {

        try {

            const entregaCompleta =
                await entregaInformeRepository.findByIdParaNotificacion(id);

            const nombreTutorDocente = `${tutorDocente?.Usuario?.nombres ?? ""} ${tutorDocente?.Usuario?.apellidos ?? ""}`.trim();

            await notificarRevisionInformeTutorDocente({
                entrega: entregaCompleta,
                nombreTutorDocente,
                estado: estado_tutor_docente,
                observacion,
                notificacionRepository
            });

        } catch (error) {

            console.error(
                "Error notificando la revisión del informe:",
                error
            );

        }

    }

    return actualizado;

};