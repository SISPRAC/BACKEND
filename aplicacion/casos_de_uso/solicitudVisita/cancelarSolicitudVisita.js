import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

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

    /*
    |--------------------------------------------------------------------------
    | Obtener solicitud
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
        solicitud.estado !== "Aceptada"
    ) {
        throw new BadRequestError(
            "Solo se pueden cancelar solicitudes de visita pendientes o aceptadas"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validar si la visita ya fue realizada
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Obtener nombre del Tutor Docente
    |--------------------------------------------------------------------------
    */

    const usuarioTutorDocente =
        solicitud.tutorDocente?.Usuario;

    console.log(
        "USUARIO DEL TUTOR DOCENTE:",
        usuarioTutorDocente
    );

    const nombreTutorDocente =
        usuarioTutorDocente
            ? `${usuarioTutorDocente.nombres} ${usuarioTutorDocente.apellidos}`
            : "El Tutor Docente";

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
        | Cancelar solicitud
        |--------------------------------------------------------------------------
        */

        await solicitudVisitaRepository.cancelar(
            solicitudId,
            motivo.trim(),
            transaction
        );

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
                "POSTULACION ENCONTRADA:",
                postulacion
            );

            if (!postulacion) {

                console.log(
                    "❌ NO HAY POSTULACION ACEPTADA PARA:",
                    candidato.id,
                    practicaPracticante.practica_id
                );

                continue;
            }

            console.log(
                "✅ POSTULACION EXISTE:",
                postulacion.id
            );

            /*
            |--------------------------------------------------------------------------
            | Obtener Tutor Empresarial
            |--------------------------------------------------------------------------
            */

            const tutorEmpresarial =
                postulacion
                    .AperturaVacante
                    ?.TutorEmpresa;

            console.log(
                "TUTOR EMPRESARIAL:",
                tutorEmpresarial
            );

            const usuarioTutor =
                tutorEmpresarial?.Usuario;

            console.log(
                "USUARIO TUTOR EMPRESARIAL:",
                usuarioTutor
            );

            if (!usuarioTutor) {

                console.log(
                    "❌ NO SE ENCONTRÓ USUARIO DEL TUTOR EMPRESARIAL"
                );

                continue;
            }

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

            if (usuarioPracticante) {

                const nombreCompleto =
                    `${usuarioPracticante.nombres} ${usuarioPracticante.apellidos}`;

                tutoresNotificados
                    .get(usuarioTutor.id)
                    .push(nombreCompleto);
            }
        }

        console.log(
            "TUTORES A NOTIFICAR:",
            tutoresNotificados
        );

        /*
        |--------------------------------------------------------------------------
        | Crear las notificaciones
        |--------------------------------------------------------------------------
        */

        for (
            const [
                usuarioIdTutor,
                nombresPracticantes
            ] of tutoresNotificados
        ) {

            console.log(
                "CREANDO NOTIFICACIÓN PARA:",
                usuarioIdTutor
            );

            await notificacionRepository.create(
                {
                    usuario_id:
                        usuarioIdTutor,

                    titulo:
                        "Solicitud de visita cancelada",

                    descripcion:
                        `El Tutor Docente ${nombreTutorDocente} ha cancelado la solicitud de visita para los practicantes: ${nombresPracticantes.join(", ")}. Motivo: ${motivo.trim()}`,

                    estado:
                        "SIN_LEER"
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