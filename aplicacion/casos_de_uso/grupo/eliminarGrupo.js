
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import {
    notificarTutorDocenteDesasignado
} from "../notificarEmail/notificarTutorDocenteDesasignado.js";

export const eliminarGrupo = async (
    {
        grupoRepository,
        grupoCandidatoRepository,
        TutorDocenteRepository,
        practicaRepository,
        notificacionRepository
    },
    id
) => {

    // ============================================================
    // BUSCAR GRUPO
    // ============================================================

    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError( 
            "El grupo no existe"
        );
    }

    // ============================================================
    // VERIFICAR SI TIENE PRACTICANTES
    // ============================================================

    const tienePracticantes =
        await grupoRepository.tienePracticantes(id);

    if (tienePracticantes) {
        throw new ConflictError(
            "No se puede eliminar el grupo porque tiene practicantes asignados"
        );
    }

    // ============================================================
    // OBTENER INFORMACIÓN DEL TUTOR DOCENTE
    // ============================================================

    let tutorAnterior = null;
    let usuarioTutorAnterior = null;
    let nombreTutorAnterior = "";
    let nombrePeriodo = "";

    if (grupo.tutorDocente_id) {

        tutorAnterior = await TutorDocenteRepository.findById(
            grupo.tutorDocente_id
        );

        if (!tutorAnterior) {
            throw new NotFoundError(
                "No se encontró el tutor docente asignado al grupo."
            );
        }

        usuarioTutorAnterior = tutorAnterior.Usuario;

        nombreTutorAnterior = [
            usuarioTutorAnterior?.nombres,
            usuarioTutorAnterior?.apellidos
        ].filter(Boolean).join(" ");

        // Obtener práctica
        const practica = await practicaRepository.findById(
            grupo.practica_id
        );

        if (!practica) {
            throw new NotFoundError(
                "No se encontró la práctica asociada al grupo."
            );
        }

        nombrePeriodo =
            practica.Periodo?.nombre ?? practica.periodo_id;
    }

    // ============================================================
    // ELIMINAR RELACIONES ACTUALES
    // ============================================================

    await grupoCandidatoRepository.deleteByGrupo(id);

    // ============================================================
    // ELIMINAR GRUPO
    // ============================================================

    await grupoRepository.delete(id);

    // ============================================================
    // NOTIFICAR DESASIGNACIÓN DEL TUTOR DOCENTE
    // ============================================================

    if (tutorAnterior) {

        // Notificación interna
        await crearNotificacion(
            { notificacionRepository },
            {
                usuario_id: tutorAnterior.usuario_id,

                titulo: "Desasignación como Tutor Docente",

                descripcion: `Has sido desasignado como Tutor Docente debido a la eliminación del grupo "${grupo.nombre}", correspondiente al período de prácticas ${nombrePeriodo}.`
            }
        );

        // Notificación por correo
        if (usuarioTutorAnterior?.correo) {

            await notificarTutorDocenteDesasignado({
                correo: usuarioTutorAnterior.correo,
                nombreTutor: nombreTutorAnterior,
                nombreGrupo: grupo.nombre,
                nombrePeriodo,
                motivo: "ELIMINACION_GRUPO"
            });

        }
    }

    return {
        message: "Grupo eliminado correctamente"
    };
};
