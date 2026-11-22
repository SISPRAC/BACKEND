import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { notificarCambioSolicitudVisita } from "../notificarEmail/notificarCambioSolicitudVisita.js";

export const editarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        solicitudVisitaFechaRepository,
        postulacionRepository,
        notificacionRepository,
        sequelize
    },
    solicitudId,
    data
) => {

    if (!data) {
        throw new BadRequestError(
            "Los datos para editar la solicitud de visita son obligatorios"
        );
    }

    const { fechas } = data;

    if (!fechas || !Array.isArray(fechas) || fechas.length === 0) {
        throw new BadRequestError(
            "Debe proponer al menos una fecha para la visita"
        );
    }

    // Validar fechas nuevas
    for (const fecha of fechas) {

        if (!fecha.fecha_inicio || !fecha.fecha_fin) {
            throw new BadRequestError(
                "Todas las fechas propuestas deben tener fecha de inicio y fecha de fin"
            );
        }

        if (new Date(fecha.fecha_inicio) > new Date(fecha.fecha_fin)) {
            throw new BadRequestError(
                "La fecha de inicio debe ser anterior a la fecha de fin"
            );
        }

        if (!fecha.hora_inicio || !fecha.hora_fin) {
            throw new BadRequestError(
                "Todas las disponibilidades deben tener hora de inicio y hora de fin"
            );
        }

        if (fecha.hora_inicio >= fecha.hora_fin) {
            throw new BadRequestError(
                "La hora de inicio debe ser anterior a la hora de fin"
            );
        }
    }

    // Buscar solicitud
    const solicitud =
        await solicitudVisitaRepository.findByIdWithDetails(solicitudId);

    if (!solicitud) {
        throw new NotFoundError("No se encontró la solicitud de visita");
    }

    // Validar estado
    if (
        solicitud.estado !== "Pendiente" &&
        solicitud.estado !== "Rechazada" &&
        solicitud.estado !== "Cancelada"
    ) {
        throw new BadRequestError(
            "Solo se pueden editar solicitudes de visita pendientes, rechazadas o canceladas"
        );
    }

    // Tutor docente
    const tutorDocente = solicitud.tutorDocente;

    if (!tutorDocente) {
        throw new NotFoundError(
            "No se encontró el tutor docente asociado a la solicitud"
        );
    }

    const usuarioTutorDocente = tutorDocente.Usuario;

    if (!usuarioTutorDocente) {
        throw new NotFoundError(
            "No se encontró el usuario asociado al tutor docente"
        );
    }

    const nombreTutorDocente =
        `${usuarioTutorDocente.nombres} ${usuarioTutorDocente.apellidos}`;

    // Practicantes de la solicitud
    const practicantes =
        await solicitudVisitaRepository
            .findPracticantesWithDetailsBySolicitudId(solicitudId);

    const transaction = await sequelize.transaction();

    // Se llena dentro de la transacción y se usa después del commit
    const tutoresNotificados = new Map();

    try {

        // Las fechas anteriores NO se eliminan; solo se agregan las nuevas.
        const fechasSolicitud =
            fechas.map((fecha) => ({
                solicitud_visita_id: solicitudId,
                fecha_inicio: fecha.fecha_inicio,
                fecha_fin: fecha.fecha_fin,
                hora_inicio: fecha.hora_inicio,
                hora_fin: fecha.hora_fin,
                seleccionada: false
            }));

        await solicitudVisitaFechaRepository.createMany(
            fechasSolicitud,
            transaction
        );

        // Si estaba Rechazada o Cancelada, vuelve a Pendiente
        if (
            solicitud.estado === "Rechazada" ||
            solicitud.estado === "Cancelada"
        ) {
            await solicitudVisitaRepository.actualizarEstado(
                solicitudId,
                "Pendiente",
                transaction
            );
        }

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
            tipo: "REPROGRAMADA",
            tutores: [...tutoresNotificados.values()]
                .filter((t) => t.nombresPracticantes.length > 0),
            nombreTutorDocente,
            fechas,
            notificacionRepository
        });

    } catch (errorNotificacion) {

        console.error(
            "Error notificando la reprogramación de la solicitud de visita:",
            errorNotificacion
        );
    }

    return await solicitudVisitaRepository.findByIdWithDetails(solicitudId);
};