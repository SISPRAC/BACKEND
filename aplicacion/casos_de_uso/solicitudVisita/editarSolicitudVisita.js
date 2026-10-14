import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const editarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        solicitudVisitaFechaRepository,
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

    /*
    |--------------------------------------------------------------------------
    | Validar fechas nuevas
    |--------------------------------------------------------------------------
    */

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

        if (
            !fecha.hora_inicio ||
            !fecha.hora_fin
        ) {
            throw new BadRequestError(
                "Todas las disponibilidades deben tener hora de inicio y hora de fin"
            );
        }

        if (
            fecha.hora_inicio >=
            fecha.hora_fin
        ) {
            throw new BadRequestError(
                "La hora de inicio debe ser anterior a la hora de fin"
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Buscar solicitud
    |--------------------------------------------------------------------------
    */

    const solicitud =
        await solicitudVisitaRepository.findByIdWithDetails(
            solicitudId
        );

    console.log(
        "SOLICITUD ENCONTRADA:",
        solicitud
    );

    if (!solicitud) {
        throw new NotFoundError(
            "No se encontró la solicitud de visita"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validar estado
    |--------------------------------------------------------------------------
    */

    if (
        solicitud.estado !== "Pendiente" &&
        solicitud.estado !== "Rechazada" &&
        solicitud.estado !== "Cancelada"
    ) {
        throw new BadRequestError(
            "Solo se pueden editar solicitudes de visita pendientes, rechazadas o canceladas"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Obtener Tutor Docente
    |--------------------------------------------------------------------------
    */

    const tutorDocente =
        solicitud.tutorDocente;

    if (!tutorDocente) {
        throw new NotFoundError(
            "No se encontró el tutor docente asociado a la solicitud"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Obtener Usuario del Tutor Docente
    |--------------------------------------------------------------------------
    */

    const usuarioTutorDocente =
        tutorDocente.Usuario;

    console.log(
        "USUARIO DEL TUTOR DOCENTE:",
        usuarioTutorDocente
    );

    if (!usuarioTutorDocente) {
        throw new NotFoundError(
            "No se encontró el usuario asociado al tutor docente"
        );
    }

    const nombreTutorDocente =
        `${usuarioTutorDocente.nombres} ${usuarioTutorDocente.apellidos}`;

    /*
    |--------------------------------------------------------------------------
    | Obtener practicantes de la solicitud
    |--------------------------------------------------------------------------
    */

    const practicantes =
        await solicitudVisitaRepository
            .findPracticantesWithDetailsBySolicitudId(
                solicitudId
            );

    console.log(
        "PRACTICANTES DE LA SOLICITUD:",
        practicantes
    );

    /*
    |--------------------------------------------------------------------------
    | Iniciar transacción
    |--------------------------------------------------------------------------
    */

    const transaction =
        await sequelize.transaction();

    try {

        /*
        |--------------------------------------------------------------------------
        | Agregar nuevas fechas
        |--------------------------------------------------------------------------
        |
        | Las fechas anteriores NO se eliminan.
        | Solamente se agregan las nuevas disponibilidades.
        |
        */

        const fechasSolicitud =
            fechas.map((fecha) => ({
                solicitud_visita_id:
                    solicitudId,

                fecha_inicio:
                    fecha.fecha_inicio,

                fecha_fin:
                    fecha.fecha_fin,

                hora_inicio:
                    fecha.hora_inicio,

                hora_fin:
                    fecha.hora_fin,

                seleccionada:
                    false
            }));

        await solicitudVisitaFechaRepository.createMany(
            fechasSolicitud,
            transaction
        );

        /*
        |--------------------------------------------------------------------------
        | Si estaba Rechazada o Cancelada, vuelve a Pendiente
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Agrupar practicantes por Tutor Empresarial
        |--------------------------------------------------------------------------
        */

        const tutoresNotificados =
            new Map();

        for (const item of practicantes) {

            const practicaPracticante =
                item.practicaPracticante;

            console.log(
                "PRACTICA PRACTICANTE:",
                practicaPracticante
            );

            if (!practicaPracticante) {

                console.log(
                    "❌ NO SE ENCONTRÓ PracticaPracticante"
                );

                continue;
            }

            const practicante =
                practicaPracticante.practicante;

            console.log(
                "PRACTICANTE:",
                practicante
            );

            if (!practicante) {

                console.log(
                    "❌ NO SE ENCONTRÓ Practicante"
                );

                continue;
            }

            const candidato =
                practicante.candidato;

            console.log(
                "CANDIDATO:",
                candidato
            );

            if (!candidato) {

                console.log(
                    "❌ NO SE ENCONTRÓ Candidato"
                );

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Buscar postulación aceptada
            |--------------------------------------------------------------------------
            */

            const postulacion =
                await postulacionRepository
                    .findAceptadaByCandidatoYPractica(
                        candidato.id,
                        practicaPracticante.practica_id,
                        transaction
                    );

            console.log(
                "========================================"
            );

            console.log(
                "CANDIDATO ID:",
                candidato.id
            );

            console.log(
                "PRACTICA ID:",
                practicaPracticante.practica_id
            );

            console.log(
                "POSTULACION COMPLETA:",
                postulacion
            );

            if (!postulacion) {

                console.log(
                    "❌ NO SE ENCONTRÓ POSTULACIÓN ACEPTADA"
                );

                console.log(
                    "========================================"
                );

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Obtener Tutor Empresarial
            |--------------------------------------------------------------------------
            */

            const aperturaVacante =
                postulacion.AperturaVacante;

            console.log(
                "APERTURA VACANTE:",
                aperturaVacante
            );

            const tutorEmpresarial =
                aperturaVacante?.TutorEmpresa;

            console.log(
                "TUTOR EMPRESARIAL:",
                tutorEmpresarial
            );

            const usuarioTutor =
                tutorEmpresarial?.Usuario;

            console.log(
                "USUARIO DEL TUTOR EMPRESARIAL:",
                usuarioTutor
            );

            if (!usuarioTutor) {

                console.log(
                    "❌ NO SE ENCONTRÓ Usuario DEL TUTOR EMPRESARIAL"
                );

                console.log(
                    "========================================"
                );

                continue;
            }

            console.log(
                "✅ TUTOR EMPRESARIAL ENCONTRADO:",
                usuarioTutor.id
            );

            /*
            |--------------------------------------------------------------------------
            | Crear grupo de notificaciones
            |--------------------------------------------------------------------------
            */

            if (
                !tutoresNotificados.has(
                    usuarioTutor.id
                )
            ) {

                tutoresNotificados.set(
                    usuarioTutor.id,
                    []
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Obtener nombre del practicante
            |--------------------------------------------------------------------------
            */

            const usuarioPracticante =
                candidato.Usuario;

            console.log(
                "USUARIO DEL PRACTICANTE:",
                usuarioPracticante
            );

            if (usuarioPracticante) {

                const nombreCompleto =
                    `${usuarioPracticante.nombres} ${usuarioPracticante.apellidos}`;

                tutoresNotificados
                    .get(usuarioTutor.id)
                    .push(nombreCompleto);
            }

            console.log(
                "MAP ACTUAL:",
                tutoresNotificados
            );

            console.log(
                "========================================"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Crear notificaciones
        |--------------------------------------------------------------------------
        */

        for (
            const [
                usuarioIdTutor,
                nombresPracticantes
            ] of tutoresNotificados
        ) {

            await crearNotificacion(
                {
                    notificacionRepository
                },
                {
                    usuario_id:
                        usuarioIdTutor,

                    titulo:
                        "Solicitud de visita reprogramada",

                    descripcion:
                        `El tutor docente ${nombreTutorDocente} ha actualizado las fechas propuestas para la visita de los practicantes: ${nombresPracticantes.join(", ")}. La solicitud se encuentra pendiente de revisión. Por favor, revise nuevamente las disponibilidades propuestas.`
                },
                transaction
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Confirmar transacción
        |--------------------------------------------------------------------------
        */

        await transaction.commit();

        /*
        |--------------------------------------------------------------------------
        | Retornar solicitud actualizada
        |--------------------------------------------------------------------------
        */

        return await solicitudVisitaRepository
            .findByIdWithDetails(
                solicitudId
            );

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};