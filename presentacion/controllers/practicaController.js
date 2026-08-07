import { actualizarPractica } from "../../aplicacion/casos_de_uso/practica/actualizarPractica.js";
import { crearPractica } from "../../aplicacion/casos_de_uso/practica/crearPractica.js";
import { eliminarPractica } from "../../aplicacion/casos_de_uso/practica/eliminarPractica.js";
import { obtenerPracticas } from "../../aplicacion/casos_de_uso/practica/obtenerPracticas.js";
import { obtenerPracticaPorId } from "../../aplicacion/casos_de_uso/practica/obtenerPracticasPorId.js";
import { obtenerPracticaPorPeriodo } from "../../aplicacion/casos_de_uso/practica/obtenerPracticasPorPeriodo.js";

import { practicaRepository } from "../../infraestructura/repositorios/practicaRepositoryImpl.js";
import { periodoRepository } from "../../infraestructura/repositorios/periodoRepositoryImpl.js";


export const CrearPracticaController = async (req, res) => {

    try {

        const result =await crearPractica(
            {
                practicaRepository,
                periodoRepository
            },
            req.body
        );

        return res.status(201).json(result);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        console.log("Error backend: ", error);
        return res.status(500).json({
            message: "Error interno del servidor", error: error.message
        });
    }
};


export const eliminarPracticaController = async (req, res) => {

    try {

        await eliminarPractica(
            {
                practicaRepository
            },
            req.params.id
        );

        return res.status(200).json({
            message: "Práctica eliminada correctamente"
        });

    } catch (error) {

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


export const obtenerPracticasController = async (req, res) => {

    try {

        const practicas = await obtenerPracticas({
            practicaRepository
        });

        return res.status(200).json(practicas);

    } catch (error) {

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


export const obtenerPracticaPorIdController = async (req, res) => {

    try {

        const practica = await obtenerPracticaPorId(
            {
                practicaRepository
            },
            req.params.id
        );

        return res.status(200).json(practica);

    } catch (error) {

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


export const obtenerPracticaPorPeriodoController = async (req, res) => {

    try {

        const practica = await obtenerPracticaPorPeriodo(
            {
                practicaRepository
            },
            req.params.periodo_id
        );

        return res.status(200).json(practica);

    } catch (error) {

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


export const actualizarPracticaController = async (req, res) => {

    try {

        const practicaActualizada = await actualizarPractica(
            {
                practicaRepository
            },
            req.params.id,
            req.body
        );

        return res.status(200).json(practicaActualizada);

    } catch (error) {

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