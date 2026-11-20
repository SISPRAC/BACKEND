import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import { notificarRespuestaSolicitudVisita } from "../notificarEmail/notificarRespuestaSolicitudVisita.js";
import { obtenerContextoSolicitudVisita } from "../notificarEmail/obtenerContextoSolicitudVisita.js";
export const crearVisita = async (
    {
        visitaRepository,
        solicitudVisitaRepository,
        solicitudVisitaFechaRepository,
        TutorDocenteRepository,
        tutorEmpresaRepository,
        notificacionRepository,
        sequelize
    },
    data,
    usuarioId
) => {

    if (!data) {
        throw new BadRequestError("Los datos para crear la visita son obligatorios");
    }

    if (!data.solicitud_visita_id) {
        throw new BadRequestError("La solicitud de visita es obligatoria");
    }

    if (!data.solicitud_visita_fecha_id) {
        throw new BadRequestError("La fecha seleccionada es obligatoria");
    }

    if (!data.fecha_visita) {
        throw new BadRequestError("La fecha de la visita es obligatoria");
    }

    if (!data.hora_visita) {
        throw new BadRequestError("La hora de la visita es obligatoria");
    }

    if (!usuarioId) {
        throw new BadRequestError("El usuario autenticado es obligatorio");
    }

    const transaction = await sequelize.transaction();

    let visita;
    let tutorDocente;
    let nombreTutorEmpresa;

    try {

        // 1. BUSCAR SOLICITUD
        const solicitud =
            await solicitudVisitaRepository.findById(data.solicitud_visita_id);

        if (!solicitud) {
            throw new NotFoundError("La solicitud de visita no existe");
        }

        // 2. VALIDAR ESTADO
        if (solicitud.estado !== "Pendiente") {
            throw new ConflictError("La solicitud de visita ya fue respondida");
        }

        // 3. BUSCAR TUTOR DOCENTE (con su usuario, para el correo)
        tutorDocente =
            await TutorDocenteRepository.findById(
                solicitud.tutor_docente_id
            );

        if (!tutorDocente) {
            throw new NotFoundError("El tutor docente de la solicitud no existe");
        }

        // 4. BUSCAR TUTOR EMPRESARIAL AUTENTICADO
        const tutorEmpresa =
            await tutorEmpresaRepository.findByUserId(usuarioId);

        if (!tutorEmpresa) {
            throw new NotFoundError("El tutor empresarial autenticado no existe");
        }

        nombreTutorEmpresa =
            `${tutorEmpresa.Usuario.nombres} ${tutorEmpresa.Usuario.apellidos}`;

        // 5. BUSCAR OPCIÓN SELECCIONADA
        const fechaSeleccionada =
            await solicitudVisitaFechaRepository.findById(
                data.solicitud_visita_fecha_id
            );

        if (!fechaSeleccionada) {
            throw new NotFoundError("La fecha seleccionada no existe");
        }

        // 6. VALIDAR QUE PERTENEZCA A LA SOLICITUD
        if (
            fechaSeleccionada.solicitud_visita_id !==
            data.solicitud_visita_id
        ) {
            throw new BadRequestError(
                "La fecha seleccionada no pertenece a la solicitud"
            );
        }

        // 7. VALIDAR FECHA DENTRO DEL RANGO
        if (
            data.fecha_visita < fechaSeleccionada.fecha_inicio ||
            data.fecha_visita > fechaSeleccionada.fecha_fin
        ) {
            throw new BadRequestError(
                "La fecha de la visita no está dentro del rango seleccionado"
            );
        }

        // 8. VALIDAR HORA DENTRO DEL HORARIO
        if (
            data.hora_visita < fechaSeleccionada.hora_inicio ||
            data.hora_visita > fechaSeleccionada.hora_fin
        ) {
            throw new BadRequestError(
                "La hora de la visita no está dentro del horario seleccionado"
            );
        }

        // 9. DESELECCIONAR TODAS LAS OPCIONES
        await solicitudVisitaFechaRepository.deseleccionarTodas(
            data.solicitud_visita_id,
            transaction
        );

        // 10. MARCAR OPCIÓN SELECCIONADA
        await solicitudVisitaFechaRepository.seleccionar(
            data.solicitud_visita_fecha_id,
            transaction
        );

        // 11. ACTUALIZAR SOLICITUD
        await solicitudVisitaRepository.updateEstado(
            data.solicitud_visita_id,
            "Aceptada",
            usuarioId,
            null,
            new Date(),
            transaction
        );

        // 12. CREAR VISITA
        visita = await visitaRepository.create(
            {
                solicitud_visita_id: data.solicitud_visita_id,
                fecha_visita: data.fecha_visita,
                hora_visita: data.hora_visita
            },
            transaction
        );

        // 13. CONFIRMAR
        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }

    // 14. NOTIFICAR AL TUTOR DOCENTE (interna + correo), fuera de la transacción
    try {

        const { nombresPracticantes, nombreEmpresa } =
            await obtenerContextoSolicitudVisita(
                solicitudVisitaRepository,
                data.solicitud_visita_id
            );

        await notificarRespuestaSolicitudVisita({
            aceptada: true,
            usuarioTutorDocente: tutorDocente.Usuario,
            nombreTutorEmpresa,
            nombreEmpresa,
            nombresPracticantes,
            fechaVisita: data.fecha_visita,
            horaVisita: data.hora_visita,
            notificacionRepository
        });

    } catch (errorNotificacion) {

        console.error(
            "Error notificando la aceptación de la solicitud de visita:",
            errorNotificacion
        );
    }

    return visita;
};