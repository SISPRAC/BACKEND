
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import {
    notificarTutorDocenteAsignado
} from "../notificarEmail/notificarTutorDocenteAsignado.js";

export const crearGrupo = async (
    {
        grupoRepository,
        grupoCandidatoRepository,
        TutorDocenteRepository,
        practicaRepository,
        notificacionRepository
    },
    data
) => {

    const {
        nombre,
        practica_id,
        tutorDocente_id,
        candidatos
    } = data;

    // ============================================================
    // VALIDAR DATOS
    // ============================================================

    if (!nombre || !practica_id || !tutorDocente_id) {
        throw new BadRequestError(
            "Los datos son obligatorios"
        );
    }

    // ============================================================
    // VALIDAR NOMBRE DEL GRUPO
    // ============================================================

    const exist =
        await grupoRepository.findByNameAndPractica(
            nombre,
            practica_id
        );

    if (exist) {
        throw new ConflictError(
            "Ya existe un grupo con ese nombre en esta práctica"
        );
    }

    // ============================================================
    // OBTENER TUTOR DOCENTE
    // ============================================================

    const tutor = await TutorDocenteRepository.findById(
        tutorDocente_id
    );

    if (!tutor) {
        throw new NotFoundError(
            "El tutor docente no existe."
        );
    }

    if (!tutor.Usuario?.correo) {
        throw new BadRequestError(
            "El tutor docente no tiene un correo electrónico registrado."
        );
    }

    // ============================================================
    // OBTENER PRÁCTICA
    // ============================================================

    const practica = await practicaRepository.findById(
        practica_id
    );

    if (!practica) {
        throw new NotFoundError(
            "La práctica no existe."
        );
    }

    // ============================================================
    // CREAR GRUPO
    // ============================================================

    const newGrupo = await grupoRepository.create({
        nombre,
        practica_id,
        tutorDocente_id
    });

    // ============================================================
    // ASIGNAR CANDIDATOS AL GRUPO
    // ============================================================

    if (candidatos?.length > 0) {

        await grupoCandidatoRepository.createMany(
            candidatos.map((candidato_id) => ({
                grupo_id: newGrupo.id,
                candidato_id
            }))
        );
    }

    // ============================================================
    // DATOS DEL TUTOR
    // ============================================================

    const usuarioTutor = tutor.Usuario;

    const nombreTutor = [
        usuarioTutor.nombres,
        usuarioTutor.apellidos
    ].filter(Boolean).join(" ");

    // ============================================================
    // DATOS DE LA ASIGNACIÓN
    // ============================================================
    const nombrePeriodo =
        practica.Periodo?.nombre ?? practica.periodo_id;

    const cantidadPracticantes = candidatos?.length ?? 0;

    // ============================================================
    // NOTIFICACIÓN INTERNA
    // ============================================================

    await crearNotificacion(
        { notificacionRepository },
        {
            usuario_id: tutor.usuario_id,

            titulo: "Asignación como Tutor Docente",

            descripcion: `Has sido asignado como Tutor Docente del "${newGrupo.nombre}", correspondiente al período de prácticas ${nombrePeriodo}. El grupo cuenta con ${cantidadPracticantes} practicantes asignados. Ingresa a SISPRAC para consultar su información y realizar el seguimiento correspondiente.`
        }
    );

    // ============================================================
    // NOTIFICACIÓN POR CORREO
    // ============================================================

    await notificarTutorDocenteAsignado({
        correo: usuarioTutor.correo,
        nombreTutor,
        nombreGrupo: newGrupo.nombre,
        nombrePeriodo,
        cantidadPracticantes
    });

    return newGrupo;
};
