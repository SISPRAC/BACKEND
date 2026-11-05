import { getTutorDocentes } from "../../aplicacion/casos_de_uso/tutorDocente/getTutorDocentes.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";
import { invitarTutorDocente } from "../../aplicacion/casos_de_uso/invitarUsuario/invitarTutorDocente.js";

import { getGruposByPractica } from "../../aplicacion/casos_de_uso/tutorDocente/getMiGrupobyPractica.js";
import { getPracticantesGrupo } from "../../aplicacion/casos_de_uso/tutorDocente/getPracticantesGrupo.js";


export const getTutorDocentesController = async (req, res) => {
    try {
        const tutorDocentes = await getTutorDocentes(
            TutorDocenteRepository
        );

        res.status(200).json(tutorDocentes);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener tutor docentes"
        });
    }
};


export const invitarTutorDocenteController = async (req, res) => {

    try {

        const resultado = await invitarTutorDocente({
            correo: req.body.correo
        });

        return res.status(200).json(resultado);

    } catch (error) {

        console.log(
            "Error al enviar invitación al tutor docente:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


export const getGruposByPracticaController = async (req, res) => {

    try {

        const { practicaId } = req.params;

        const usuarioId = req.user.id;

        const grupos = await getGruposByPractica(
            TutorDocenteRepository,
            usuarioId,
            practicaId
        );

        return res.status(200).json(grupos);

    } catch (error) {

        console.log(
            "Error al obtener grupos del tutor docente:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener grupos"
        });
    }
};


export const getPracticantesGrupoController = async (req, res) => {

    try {

        const { grupoId, practicaId } = req.params;

        const resultado = await getPracticantesGrupo(
            TutorDocenteRepository,
            grupoId,
            practicaId
        );

        return res.status(200).json(resultado);

    } catch (error) {

        console.log(
            "Error al obtener practicantes del grupo:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener practicantes del grupo"
        });
    }
};