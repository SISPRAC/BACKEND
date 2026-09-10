import { tipoInformeRepository } from "../../infraestructura/repositorios/tipoInformeRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { crearTipoInforme } from "../../aplicacion/casos_de_uso/tipoInforme/crearTipoInforme.js";
import { actualizarTipoInforme } from "../../aplicacion/casos_de_uso/tipoInforme/actualizarTipoInforme.js";
import { eliminarTipoInforme } from "../../aplicacion/casos_de_uso/tipoInforme/eliminarTipoInforme.js";
import { getTipoInforme } from "../../aplicacion/casos_de_uso/tipoInforme/getTipoInforme.js";
import { getTiposInforme } from "../../aplicacion/casos_de_uso/tipoInforme/getTiposInforme.js";


export const createTipoInforme = async (req, res) => {

    try {

        const tipoInforme =
            await crearTipoInforme(
                tipoInformeRepository,
                archivoRepository,
                req.body,
                req.file
            );

        return res.status(201).json(tipoInforme);

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


export const updateTipoInforme = async (req, res) => {

    try {

        const tipoInforme =
            await actualizarTipoInforme(
                tipoInformeRepository,
                archivoRepository,
                req.params.id,
                req.body,
                req.file
            );

        return res.status(200).json(tipoInforme);

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


export const deleteTipoInforme = async (req, res) => {

    try {

        const { id } = req.params;

        await eliminarTipoInforme(
            tipoInformeRepository,
            archivoRepository,
            id
        );

        return res.json({
            message: "Tipo de informe eliminado correctamente."
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


export const findTipoInforme = async (req, res) => {

    try {

        const { id } = req.params;

        const tipoInforme =
            await getTipoInforme(
                tipoInformeRepository,
                id
            );

        return res.json(tipoInforme);

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


export const findTiposInforme = async (req, res) => {

    try {

        const tiposInforme =
            await getTiposInforme(
                tipoInformeRepository
            );

        return res.json(tiposInforme);

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