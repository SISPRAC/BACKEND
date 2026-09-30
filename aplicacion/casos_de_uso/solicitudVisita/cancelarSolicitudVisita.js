import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const cancelarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        postulacionRepository,
        notificacionRepository,
        crearNotificacion
    },
    solicitudId,
    motivo
) => {

    if (!motivo || !motivo.trim()) {
        throw new BadRequestError(
            "El motivo de cancelación es obligatorio"
        );
    }

    const solicitud =
        await solicitudVisitaRepository.findByIdWithDetails(
            solicitudId
        );

    if (!solicitud) {
        throw new NotFoundError(
            "No se encontró la solicitud de visita"
        );
    }

    if (solicitud.estado !== "Pendiente") {
        throw new BadRequestError(
            "Solo se pueden cancelar solicitudes de visita pendientes"
        );
    }

    await solicitudVisitaRepository.cancelar(
        solicitudId,
        motivo.trim()
    );

    /*
     * Agrupar practicantes por tutor empresarial.
     */
    const tutoresNotificados = new Map();

    for (const item of solicitud.practicantes) {

        const practicaPracticante =
            item.practicaPracticante;

        const candidato =
            practicaPracticante
                ?.practicante
                ?.candidato;

        if (!candidato) {
            continue;
        }

        const postulacion =
            await postulacionRepository
                .findAceptadaByCandidatoYPractica(
                    candidato.id,
                    practicaPracticante.practica_id
                );

        if (!postulacion) {
            continue;
        }

        const tutorEmpresarial =
            postulacion
                .AperturaVacante
                ?.TutorEmpresa;

        const usuarioTutor =
            tutorEmpresarial?.Usuario;

        if (!usuarioTutor) {
            continue;
        }

        if (!tutoresNotificados.has(usuarioTutor.id)) {
            tutoresNotificados.set(
                usuarioTutor.id,
                []
            );
        }

        const usuarioPracticante =
            candidato.Usuario;

        if (usuarioPracticante) {

            const nombreCompleto =
                `${usuarioPracticante.nombres} ${usuarioPracticante.apellidos}`;

            tutoresNotificados
                .get(usuarioTutor.id)
                .push(nombreCompleto);
        }
    }

    for (
        const [
            usuarioIdTutor,
            nombresPracticantes
        ] of tutoresNotificados
    ) {

        await crearNotificacion(
            { notificacionRepository },
            {
                usuario_id: usuarioIdTutor,
                titulo: "Solicitud de visita cancelada",
                descripcion:
                    `El Tutor Docente ha cancelado la solicitud de visita para los practicantes: ${nombresPracticantes.join(", ")}. Motivo: ${motivo.trim()}`
            }
        );
    }

    return await solicitudVisitaRepository
        .findByIdWithDetails(solicitudId);
};