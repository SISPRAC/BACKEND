import { getTutorDocentes } from "../../aplicacion/casos_de_uso/tutorDocente/getTutorDocentes.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";
import { invitarTutorDocente } from "../../aplicacion/casos_de_uso/invitarUsuario/invitarTutorDocente.js";

export const getTutorDocentesController = async (req, res) => {
    try {
        const tutorDocentes = await getTutorDocentes(TutorDocenteRepository);
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
}

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