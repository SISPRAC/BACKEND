import { practicaInformeRepository } from "../../infraestructura/repositorios/practicaInformeRepositoryImpl.js";

import { crearPracticaInforme } from "../../aplicacion/casos_de_uso/practicaInformes/crearPracticaInforme.js";
import { actualizarPracticaInforme } from "../../aplicacion/casos_de_uso/practicaInformes/actualizarPracticaInforme.js";
import { eliminarPracticaInforme } from "../../aplicacion/casos_de_uso/practicaInformes/eliminarPracticaInforme.js";
import { getPracticaInforme } from "../../aplicacion/casos_de_uso/practicaInformes/getPracticaInforme.js";
import { getPracticaInformes } from "../../aplicacion/casos_de_uso/practicaInformes/getPracticaInformes.js";


export const createPracticaInforme = async (req, res) => {

    try {

        const informe =
            await crearPracticaInforme(
                practicaInformeRepository,
                req.body
            );

        return res.status(201).json(informe);

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


export const updatePracticaInforme = async (req, res) => {

    try {

        const informe =
            await actualizarPracticaInforme(
                practicaInformeRepository,
                req.params.id,
                req.body
            );

        return res.status(200).json(informe);

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


export const deletePracticaInforme = async (req, res) => {

    try {

        const { id } = req.params;

        await eliminarPracticaInforme(
            practicaInformeRepository,
            id
        );

        return res.json({
            message: "Informe de práctica eliminado correctamente."
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


export const findPracticaInforme = async (req, res) => {

    try {

        const { id } = req.params;

        const informe =
            await getPracticaInforme(
                practicaInformeRepository,
                id
            );

        return res.json(informe);

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


export const findPracticaInformes = async (req, res) => {

    try {

        const { practica_id } = req.params;

        const informes =
            await getPracticaInformes(
                practicaInformeRepository,
                practica_id
            );

        return res.json(informes);

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