import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { notificarCambioSolicitudVisita } from "../notificarEmail/notificarCambioSolicitudVisita.js";

export const cancelarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        postulacionRepository,
        notificacionRepository,
        sequelize
    },
    solicitudId,
    motivo
) => {

    if (!motivo || !motivo.trim()) {
        throw new BadRequestError(
            "El motivo de cancelación es obligatorio"
        );
    }

    const motivoLimpio = motivo.trim();

    // Obtener solicitud
    const solicitud =
        await solicitudVisitaRepository.findByIdWithDetails(solicitudId);

    if (!solicitud) {
        throw new NotFoundError("No se encontró la solicitud de visita");
    }

    // Validar estado
    if (
        solicitud.estado !== "Pendiente" &&
        solicitud.estado !== "Aceptada"
    ) {
        throw new BadRequestError(
            "Solo se pueden cancelar solicitudes de visita pendientes o aceptadas"
        );
    }

    // Validar si la visita ya fue realizada
    const visitas = Array.isArray(solicitud.visita)
        ? solicitud.visita
        : solicitud.visita
            ? [solicitud.visita]
            : [];

    const visitaRealizada = visitas.some(
        (visita) => Boolean(visita.fecha_realizada)
    );

    if (visitaRealizada) {
        throw new BadRequestError(
            "No se puede cancelar una solicitud cuya visita ya fue realizada"
        );
    }

    // Nombre del tutor docente
    const usuarioTutorDocente = solicitud.tutorDocente?.Usuario;

    const nombreTutorDocente =
        usuarioTutorDocente
            ? `${usuarioTutorDocente.nombres} ${usuarioTutorDocente.apellidos}`
            : "El Tutor Docente";

    // Practicantes de la solicitud
    const practicantes =
        await solicitudVisitaRepository
            .findPracticantesWithDetailsBySolicitudId(solicitudId);

    const transaction = await sequelize.transaction();

    // Se llena dentro de la transacción y se usa después del commit
    const tutoresNotificados = new Map();

    try {

        await solicitudVisitaRepository.cancelar(
            solicitudId,
            motivoLimpio,
            transaction
        );

        // Agrupar practicantes por tutor empresarial
        for (const item of practicantes) {

            const practicaPracticante = item.practicaPracticante;
            const candidato = practicaPracticante?.practicante?.candidato;

            if (!candidato) continue;

            const postulacion =
                await postulacionRepository
                    .findAceptadaByCandidatoYPractica(
                        candidato.id,
                        practicaPracticante.practica_id,
                        transaction
                    );

            const usuarioTutor =
                postulacion?.AperturaVacante?.TutorEmpresa?.Usuario;

            if (!usuarioTutor) continue;

            if (!tutoresNotificados.has(usuarioTutor.id)) {
                tutoresNotificados.set(usuarioTutor.id, {
                    usuarioTutor,
                    nombresPracticantes: []
                });
            }

            const usuarioPracticante = candidato.Usuario;

            if (usuarioPracticante) {
                tutoresNotificados
                    .get(usuarioTutor.id)
                    .nombresPracticantes.push(
                        `${usuarioPracticante.nombres} ${usuarioPracticante.apellidos}`
                    );
            }
        }

        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }

    // Notificar (interna + correo), fuera de la transacción
    try {

        await notificarCambioSolicitudVisita({
            tipo: "CANCELADA",
            tutores: [...tutoresNotificados.values()]
                .filter((t) => t.nombresPracticantes.length > 0),
            nombreTutorDocente,
            motivo: motivoLimpio,
            notificacionRepository
        });

    } catch (errorNotificacion) {

        console.error(
            "Error notificando la cancelación de la solicitud de visita:",
            errorNotificacion
        );
    }

    return await solicitudVisitaRepository.findByIdWithDetails(solicitudId);
};