import { getPracticantes } from "../../aplicacion/casos_de_uso/practicante/obtenerPracticantes.js";
import { PracticanteRepository } from "../../infraestructura/repositorios/practicanteRepositoryImpl.js";

import { obtenerPracticaPracticante } from "../../aplicacion/casos_de_uso/practicante/obtenerPracticaPracticante.js";
import { obtenerPracticantesPorPractica } from "../../aplicacion/casos_de_uso/practicante/obtenerPracticantesPorPractica.js";
import { getPracticanteById } from "../../aplicacion/casos_de_uso/practicante/getPracticante.js";
import { obtenerRequisitosDocumentosPracticante } from "../../aplicacion/casos_de_uso/practicante/obtenerRequisitosDocumentosPracticante.js";


export const obtenerPracticaPracticanteController = async (req, res) => {
    try {

        const usuarioId = req.user.id;

        const datos = await obtenerPracticaPracticante(
            PracticanteRepository,
            usuarioId
        );

        return res.status(200).json(datos);

    } catch (error) {

        console.error(
            "Error al obtener la práctica del practicante:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener la información de la práctica."
        });
    }
};


export const getPracticantesController = async (req, res) => {
    try {

        const practicantes =
            await getPracticantes(PracticanteRepository);

        res.status(200).json(practicantes);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR",
            error: error.message
        });
    }
};


export const obtenerPracticantesPorPracticaController = async (req, res) => {
    try {

        const { practicaId } = req.params;

        const practicantes =
            await obtenerPracticantesPorPractica(
                PracticanteRepository,
                practicaId
            );

        return res.status(200).json(practicantes);

    } catch (error) {

        console.error(
            "Error al obtener los practicantes de la práctica:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener los practicantes de la práctica."
        });
    }
};


export const getPracticanteByIdController = async (req, res) => {
    try {

        const { id } = req.params;

        const practicante =
            await getPracticanteById(
                PracticanteRepository,
                id
            );

        return res.status(200).json(practicante);

    } catch (error) {

        console.error(
            "Error al obtener el practicante:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener la información del practicante."
        });
    }
};


export const obtenerRequisitosDocumentosPracticanteController = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const requisitos =
            await obtenerRequisitosDocumentosPracticante(
                {
                    practicanteRepository: PracticanteRepository
                },
                id
            );

        return res.status(200).json(requisitos);

    } catch (error) {

        console.error(
            "Error al obtener los requisitos de documentos del practicante:",
            error
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener los requisitos de documentos del practicante."
        });
    }
};