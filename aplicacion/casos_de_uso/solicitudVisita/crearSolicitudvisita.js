import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const crearSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        solicitudVisitaPracticanteRepository,
        solicitudVisitaFechaRepository,
        tutorDocenteRepository,
        practicaPracticanteRepository,
        postulacionRepository,
        notificacionRepository,
        crearNotificacion,
        sequelize
    },
    userId,
    data
) => {

    if (!data) {
        throw new BadRequestError(
            "Los datos para crear la solicitud de visita son obligatorios"
        );
    }

    const {
        practicantes,
        fechas
    } = data;

    if (
        !practicantes ||
        !Array.isArray(practicantes) ||
        practicantes.length === 0
    ) {
        throw new BadRequestError(
            "Debe seleccionar al menos un practicante"
        );
    }

    if (
        !fechas ||
        !Array.isArray(fechas) ||
        fechas.length === 0
    ) {
        throw new BadRequestError(
            "Debe proponer al menos una disponibilidad para la visita"
        );
    }

    const tutorDocente =
        await tutorDocenteRepository.findByUserId(userId);

    if (!tutorDocente) {
        throw new NotFoundError(
            "No se encontró el tutor docente asociado al usuario"
        );
    }

    /*
     * Obtenemos el usuario asociado al tutor docente
     * para poder utilizar su nombre en la notificación.
     */

    if (!tutorDocente.Usuario) {
        throw new NotFoundError(
            "No se encontró el usuario asociado al tutor docente"
        );
    }

    const nombreTutorDocente =
        `${tutorDocente.Usuario.nombres} ${tutorDocente.Usuario.apellidos}`;

    /*
     * Validamos todas las disponibilidades.
     */

    for (const fecha of fechas) {

        if (
            !fecha.fecha_inicio ||
            !fecha.fecha_fin ||
            !fecha.hora_inicio ||
            !fecha.hora_fin
        ) {
            throw new BadRequestError(
                "Todas las disponibilidades deben tener fecha de inicio, fecha de fin, hora de inicio y hora de fin"
            );
        }

        /*
         * La fecha inicial puede ser igual a la fecha final.
         */

        if (
            fecha.fecha_inicio >
            fecha.fecha_fin
        ) {
            throw new BadRequestError(
                "La fecha de inicio no puede ser posterior a la fecha de fin"
            );
        }

        /*
         * La hora inicial debe ser anterior
         * a la hora final.
         */

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
     * Obtenemos la información de cada practicante,
     * su postulación aceptada y su tutor empresarial.
     */

    const informacionPracticantes = [];

    for (const practicaPracticanteId of practicantes) {

        const practicaPracticante =
            await practicaPracticanteRepository
                .findByIdWithPracticaAndCandidato(
                    practicaPracticanteId
                );

        if (!practicaPracticante) {

            console.log(
                "❌ NO SE ENCONTRÓ PRACTICA PRACTICANTE"
            );

            throw new NotFoundError(
                `No se encontró el practicante de la práctica ${practicaPracticanteId}`
            );
        }

        const candidato =
            practicaPracticante.practicante?.candidato;

        if (!candidato) {
            throw new NotFoundError(
                "No se encontró el candidato asociado al practicante"
            );
        }

        const postulacion =
            await postulacionRepository
                .findAceptadaByCandidatoYPractica(
                    candidato.id,
                    practicaPracticante.practica_id
                );

        if (!postulacion) {
            throw new NotFoundError(
                "No se encontró una postulación aceptada para el practicante"
            );
        }

        const tutorEmpresarial =
            postulacion.AperturaVacante?.TutorEmpresa;

        if (!tutorEmpresarial) {
            throw new NotFoundError(
                "No se encontró el tutor empresarial asociado al practicante"
            );
        }

        const usuarioTutor =
            tutorEmpresarial.Usuario;

        if (!usuarioTutor) {
            throw new NotFoundError(
                "No se encontró el usuario del tutor empresarial"
            );
        }

        const usuarioPracticante =
            candidato.Usuario;

        if (!usuarioPracticante) {

            console.log(
                "❌ EL CANDIDATO NO TIENE Usuario CARGADO"
            );

            throw new NotFoundError(
                "No se encontró el usuario asociado al practicante"
            );
        }

        informacionPracticantes.push({
            practicaPracticante,
            candidato,
            usuarioPracticante,
            usuarioTutor,
            empresaId:
                tutorEmpresarial.empresa_id
        });

    }

    /*
     * Todos los practicantes de una solicitud
     * deben pertenecer a la misma empresa.
     */

    const empresas = [
        ...new Set(
            informacionPracticantes.map(
                (item) => item.empresaId
            )
        )
    ];

    if (empresas.length !== 1) {
        throw new BadRequestError(
            "Los practicantes seleccionados deben pertenecer a la misma empresa"
        );
    }

    const empresaId = empresas[0];

    const transaction =
        await sequelize.transaction();

    try {

        const solicitud =
            await solicitudVisitaRepository.create(
                {
                    empresa_id: empresaId,
                    tutor_docente_id: tutorDocente.id,
                    estado: "Pendiente"
                },
                transaction
            );

        const practicantesSolicitud =
            practicantes.map(
                (practica_practicante_id) => ({
                    solicitud_visita_id:
                        solicitud.id,

                    practica_practicante_id
                })
            );

        await solicitudVisitaPracticanteRepository.createMany(
            practicantesSolicitud,
            transaction
        );

        /*
         * Guardamos las disponibilidades propuestas.
         */

        const fechasSolicitud =
            fechas.map((fecha) => ({
                solicitud_visita_id:
                    solicitud.id,

                fecha_inicio:
                    fecha.fecha_inicio,

                fecha_fin:
                    fecha.fecha_fin,

                hora_inicio:
                    fecha.hora_inicio,

                hora_fin:
                    fecha.hora_fin,

                seleccionada: false
            }));

        await solicitudVisitaFechaRepository.createMany(
            fechasSolicitud,
            transaction
        );

        await transaction.commit();

        /*
         * Agrupamos los practicantes por tutor empresarial
         * para enviar una sola notificación a cada tutor.
         */

        const tutoresNotificados =
            new Map();

        for (
            const item of informacionPracticantes
        ) {

            const usuarioTutorId =
                item.usuarioTutor.id;

            if (
                !tutoresNotificados.has(
                    usuarioTutorId
                )
            ) {

                tutoresNotificados.set(
                    usuarioTutorId,
                    []
                );

            }

            const nombreCompleto =
                `${item.usuarioPracticante.nombres} ${item.usuarioPracticante.apellidos}`;

            tutoresNotificados
                .get(usuarioTutorId)
                .push(nombreCompleto);

        }

        /*
         * Crear las notificaciones.
         */

        for (
            const [
                usuarioIdTutor,
                nombresPracticantes
            ] of tutoresNotificados
        ) {

            await crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id:
                        usuarioIdTutor,

                    titulo:
                        "Nueva solicitud de visita",

                    descripcion:
                        `El tutor docente ${nombreTutorDocente} ha solicitado una visita para los practicantes: ${nombresPracticantes.join(", ")}. Por favor, revise la solicitud y seleccione una de las disponibilidades propuestas.`
                }
            );

        }

        return solicitud;

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};
