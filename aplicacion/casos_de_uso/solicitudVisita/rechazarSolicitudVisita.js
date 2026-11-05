import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const rechazarSolicitudVisita = async (
    {
        solicitudVisitaRepository,
        tutorDocenteRepository,
        tutorEmpresaRepository,
        notificacionRepository,
        sequelize
    },
    data,
    usuarioId
) => {

    if (!data) {
        throw new BadRequestError(
            "Los datos para rechazar la solicitud son obligatorios"
        );
    }

    if (!data.solicitud_visita_id) {
        throw new BadRequestError(
            "La solicitud de visita es obligatoria"
        );
    }

    if (!data.motivo) {
        throw new BadRequestError(
            "El motivo del rechazo es obligatorio"
        );
    }

    if (!usuarioId) {
        throw new BadRequestError(
            "El usuario autenticado es obligatorio"
        );
    }

    const transaction =
        await sequelize.transaction();

    try {

        // ==========================================
        // 1. BUSCAR SOLICITUD
        // ==========================================

        const solicitud =
            await solicitudVisitaRepository.findById(
                data.solicitud_visita_id
            );

        if (!solicitud) {
            throw new NotFoundError(
                "La solicitud de visita no existe"
            );
        }


        // ==========================================
        // 2. VALIDAR ESTADO
        // ==========================================

        if (solicitud.estado !== "Pendiente") {
            throw new ConflictError(
                "La solicitud de visita ya fue respondida"
            );
        }


        // ==========================================
        // 3. BUSCAR TUTOR DOCENTE
        // ==========================================

        const tutorDocente =
            await tutorDocenteRepository.findById(
                solicitud.tutor_docente_id
            );

        if (!tutorDocente) {
            throw new NotFoundError(
                "El tutor docente de la solicitud no existe"
            );
        }


        // ==========================================
        // 4. BUSCAR TUTOR EMPRESARIAL AUTENTICADO
        // ==========================================

        const tutorEmpresa =
            await tutorEmpresaRepository.findByUserId(
                usuarioId
            );

        if (!tutorEmpresa) {
            throw new NotFoundError(
                "El tutor empresarial autenticado no existe"
            );
        }

        const nombreTutorEmpresa =
            `${tutorEmpresa.Usuario.nombres} ${tutorEmpresa.Usuario.apellidos}`;


        // ==========================================
        // 5. ACTUALIZAR SOLICITUD
        // ==========================================

        await solicitudVisitaRepository.updateEstado(
            data.solicitud_visita_id,
            "Rechazada",
            usuarioId,
            data.motivo,
            new Date(),
            transaction
        );


        // ==========================================
        // 6. NOTIFICAR AL TUTOR DOCENTE
        // ==========================================

        await notificacionRepository.create(
            {
                usuario_id:
                    tutorDocente.usuario_id,

                titulo:
                    "Solicitud de visita rechazada",

                descripcion:
                    `El tutor empresarial ${nombreTutorEmpresa} rechazó la solicitud de visita. Motivo: ${data.motivo}`,

                estado:
                    "SIN_LEER"
            },
            transaction
        );


        // ==========================================
        // 7. CONFIRMAR
        // ==========================================

        await transaction.commit();

        return {
            mensaje:
                "La solicitud de visita fue rechazada correctamente"
        };

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};