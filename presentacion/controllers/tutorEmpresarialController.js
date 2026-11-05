import { getTutorEmpresarial } from "../../aplicacion/casos_de_uso/tutorEmpresarial/geTutorEmpresarial.js";
import { getAperturasByTutorEmpresa } from "../../aplicacion/casos_de_uso/tutorEmpresarial/getAperturasByTutorEmpresa.js";
import { getAperturasByPractica} from "../../aplicacion/casos_de_uso/tutorEmpresarial/getAperturaByPractica.js";

import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";
import { invitarTutorEmpresarial } from "../../aplicacion/casos_de_uso/invitarUsuario/invitarTutorEmpresarial.js";
import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";


export const getTutorEmpresarialController = async (req, res) => {

    try {

        const tutorEmpresarial = await getTutorEmpresarial(
            tutorEmpresaRepository
        );

        return res.status(200).json(tutorEmpresarial);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener tutores empresariales"
        });
    }
};


export const invitarTutorEmpresarialController = async (req, res) => {

    try {

        const { correo } = req.body;

        const usuarioId = req.user.id;

        const empresa = await empresaRepository.findByUserId(
            usuarioId
        );

        if (!empresa) {
            return res.status(404).json({
                message: "No se encontró la empresa asociada al usuario"
            });
        }

        const resultado = await invitarTutorEmpresarial({
            correo,
            empresa_id: empresa.id
        });

        return res.status(200).json(resultado);

    } catch (error) {

        console.log(
            "Error al enviar invitación al tutor empresarial:",
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

export const getAperturasByTutorEmpresaController = async (req, res) => {

    try {

        const userId = req.user.id;

        const { periodoId, practicaId } = req.query;

        const aperturas = await getAperturasByTutorEmpresa(
            {
                tutorEmpresaRepository
            },
            userId,
            periodoId,
            practicaId
        );

        return res.status(200).json(aperturas);

    } catch (error) {

        console.log(
            "Error al obtener las aperturas de vacante:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener las aperturas de vacante"
        });
    }
};

export const getAperturasByPracticaController = async (req, res) => {

    try {

        const userId = req.user.id;

        const { practicaId } = req.params;

        const aperturas = await getAperturasByPractica(
            {
                tutorEmpresaRepository
            },
            userId,
            practicaId
        );

        return res.status(200).json(aperturas);

    } catch (error) {

        console.log(
            "Error al obtener las aperturas de la práctica:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener las aperturas de la práctica"
        });
    }
};