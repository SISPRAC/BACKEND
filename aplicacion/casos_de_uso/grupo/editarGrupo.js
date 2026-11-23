
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import {
    notificarTutorDocenteDesasignado
} from "../notificarEmail/notificarTutorDocenteDesasignado.js";

export const editarGrupo = async (
    {
        grupoRepository,
        grupoCandidatoRepository,
        TutorDocenteRepository,
        practicaRepository,
        notificacionRepository
    },
    data,
    id
) => {

    const {
        nombre,
        practica_id,
        tutorDocente_id,
        candidatos
    } = data;

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
    // VALIDAR DATOS
    // ============================================================

    if (!nombre || !practica_id || !tutorDocente_id) {
        throw new BadRequestError(
            "Los datos son obligatorios"
        );
    }

    // ============================================================
    // VALIDAR NOMBRE ÚNICO DENTRO DE LA PRÁCTICA
    // ============================================================

    const grupoExistente =
        await grupoRepository.findByNameAndPractica(
            nombre,
            practica_id
        );

    if (
        grupoExistente &&
        grupoExistente.id !== Number(id)
    ) {
        throw new ConflictError(
            "Ya existe un grupo con ese nombre en esta práctica"
        );
    }

    // ============================================================
    // DETECTAR CAMBIO DE TUTOR DOCENTE
    // ============================================================

    const tutorAnteriorId = Number(grupo.tutorDocente_id);
    const tutorNuevoId = Number(tutorDocente_id);

    const cambioTutor =
        tutorAnteriorId !== tutorNuevoId;

    let tutorAnterior = null;
    let usuarioTutorAnterior = null;
    let nombreTutorAnterior = "";
    let nombrePeriodo = "";

    if (cambioTutor) {

        // Obtener tutor anterior
        tutorAnterior = await TutorDocenteRepository.findById(
            grupo.tutorDocente_id
        );

        if (!tutorAnterior) {
            throw new NotFoundError(
                "No se encontró el tutor docente anteriormente asignado."
            );
        }

        usuarioTutorAnterior = tutorAnterior.Usuario;

        nombreTutorAnterior = [
            usuarioTutorAnterior?.nombres,
            usuarioTutorAnterior?.apellidos
        ].filter(Boolean).join(" ");

        // Obtener tutor nuevo
        const tutorNuevo = await TutorDocenteRepository.findById(
            tutorDocente_id
        );

        if (!tutorNuevo) {
            throw new NotFoundError(
                "El tutor docente seleccionado no existe."
            );
        }

        // Obtener práctica
        const practica = await practicaRepository.findById(
            practica_id
        );

        if (!practica) {
            throw new NotFoundError(
                "La práctica no existe."
            );
        }

        nombrePeriodo =
            practica.Periodo?.nombre ?? practica.periodo_id;
    }

    // ============================================================
    // ACTUALIZAR GRUPO
    // ============================================================

    const grupoActualizado =
        await grupoRepository.update(id, {
            nombre,
            practica_id,
            tutorDocente_id
        });

    // ============================================================
    // ELIMINAR RELACIONES ACTUALES
    // ============================================================

    await grupoCandidatoRepository.deleteByGrupo(id);

    // ============================================================
    // CREAR NUEVAMENTE LAS RELACIONES
    // ============================================================

    if (candidatos?.length > 0) {

        await grupoCandidatoRepository.createMany(
            candidatos.map((candidato_id) => ({
                grupo_id: id,
                candidato_id
            }))
        );
    }

    // ============================================================
    // NOTIFICAR DESASIGNACIÓN DEL TUTOR ANTERIOR
    // ============================================================

    if (cambioTutor) {

        // Notificación interna
        await crearNotificacion(
            { notificacionRepository },
            {
                usuario_id: tutorAnterior.usuario_id,

                titulo: "Desasignación como Tutor Docente",

                descripcion: `Has sido desasignado como Tutor Docente del grupo "${grupo.nombre}", correspondiente al período de prácticas ${nombrePeriodo}.`
            }
        );

        // Notificación por correo
        if (usuarioTutorAnterior?.correo) {

            await notificarTutorDocenteDesasignado({
                correo: usuarioTutorAnterior.correo,
                nombreTutor: nombreTutorAnterior,
                nombreGrupo: grupo.nombre,
                nombrePeriodo,
                motivo: "CAMBIO_TUTOR"
            });

        }
    }

    return grupoActualizado;
};
