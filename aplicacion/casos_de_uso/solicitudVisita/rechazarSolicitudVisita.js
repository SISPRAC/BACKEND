import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import { notificarRespuestaSolicitudVisita } from "../notificarEmail/notificarRespuestaSolicitudVisita.js";
import { obtenerContextoSolicitudVisita } from "../notificarEmail/obtenerContextoSolicitudVisita.js";
export const rechazarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        TutorDocenteRepository,
        tutorEmpresaRepository,
        notificacionRepository,
        sequelize
    },
    data,
    usuarioId
) => {

    if (!data) {
        throw new BadRequestError("Los datos para rechazar la solicitud son obligatorios");
    }

    if (!data.solicitud_visita_id) {
        throw new BadRequestError("La solicitud de visita es obligatoria");
    }

    if (!data.motivo || !data.motivo.trim()) {
        throw new BadRequestError("El motivo del rechazo es obligatorio");
    }

    if (!usuarioId) {
        throw new BadRequestError("El usuario autenticado es obligatorio");
    }

    const motivoLimpio = data.motivo.trim();

    const transaction = await sequelize.transaction();

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

        // 5. ACTUALIZAR SOLICITUD
        await solicitudVisitaRepository.updateEstado(
            data.solicitud_visita_id,
            "Rechazada",
            usuarioId,
            motivoLimpio,
            new Date(),
            transaction
        );

        // 6. CONFIRMAR
        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }

    // 7. NOTIFICAR AL TUTOR DOCENTE (interna + correo), fuera de la transacción
    try {

        const { nombresPracticantes, nombreEmpresa } =
            await obtenerContextoSolicitudVisita(
                solicitudVisitaRepository,
                data.solicitud_visita_id
            );

        await notificarRespuestaSolicitudVisita({
            aceptada: false,
            usuarioTutorDocente: tutorDocente.Usuario,
            nombreTutorEmpresa,
            nombreEmpresa,
            nombresPracticantes,
            motivo: motivoLimpio,
            notificacionRepository
        });

    } catch (errorNotificacion) {

        console.error(
            "Error notificando el rechazo de la solicitud de visita:",
            errorNotificacion
        );
    }

    return {
        mensaje: "La solicitud de visita fue rechazada correctamente"
    };
};