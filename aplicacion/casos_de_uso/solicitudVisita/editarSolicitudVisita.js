import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const editarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        solicitudVisitaFechaRepository,
        practicaPracticanteRepository,
        postulacionRepository,
        notificacionRepository,
        crearNotificacion,
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

    if (
        !fechas ||
        !Array.isArray(fechas) ||
        fechas.length === 0
    ) {
        throw new BadRequestError(
            "Debe proponer al menos una fecha para la visita"
        );
    }

    for (const fecha of fechas) {

        if (
            !fecha.fecha_inicio ||
            !fecha.fecha_fin
        ) {
            throw new BadRequestError(
                "Todas las fechas propuestas deben tener fecha de inicio y fecha de fin"
            );
        }

        if (
            new Date(fecha.fecha_inicio) >=
            new Date(fecha.fecha_fin)
        ) {
            throw new BadRequestError(
                "La fecha de inicio debe ser anterior a la fecha de fin"
            );
        }
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
            "Solo se pueden editar solicitudes de visita pendientes"
        );
    }

    const transaction =
        await sequelize.transaction();

    try {

        await solicitudVisitaFechaRepository
            .deleteBySolicitudVisitaId(
                solicitudId,
                transaction
            );

        const fechasSolicitud =
            fechas.map((fecha) => ({
                solicitud_visita_id: solicitudId,
                fecha_inicio: fecha.fecha_inicio,
                fecha_fin: fecha.fecha_fin,
                seleccionada: false
            }));

        await solicitudVisitaFechaRepository.createMany(
            fechasSolicitud,
            transaction
        );

        await transaction.commit();

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
                    titulo: "Solicitud de visita actualizada",
                    descripcion:
                        `El Tutor Docente ha actualizado las fechas propuestas para la visita de los practicantes: ${nombresPracticantes.join(", ")}. Por favor, revise nuevamente las fechas propuestas.`
                }
            );
        }

        return await solicitudVisitaRepository
            .findByIdWithDetails(solicitudId);

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};