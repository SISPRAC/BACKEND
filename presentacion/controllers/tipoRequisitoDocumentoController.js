import { tipoRequisitoDocumentoRepository } from "../../infraestructura/repositorios/tipoRequisitoDocumentoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { crearTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/crearTipoRequisitoDocumento.js";
import { actualizarTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/actualizarTipoRequisitoDocumento.js";
import { eliminarTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/eliminarTipoRequisitoDocumento.js";
import { getTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getTipoRequisitoDocumento.js";
import { getTiposRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getTiposRequisitoDocumento.js";
import { getTiposRequisitoDocumentoByRol } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getTiposRequisitoDocumentoByRol.js";


export const createTipoRequisitoDocumento = async (req, res) => { 

    try {

        const tipo =
            await crearTipoRequisitoDocumento(
                tipoRequisitoDocumentoRepository,
                archivoRepository,
                req.body,
                req.file
            );

        return res.status(201).json(tipo);

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


export const updateTipoRequisitoDocumento = async (req, res) => {

    try {

        const tipo =
            await actualizarTipoRequisitoDocumento(
                tipoRequisitoDocumentoRepository,
                archivoRepository,
                req.params.id,
                req.body,
                req.file
            );

        return res.status(200).json(tipo);

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


export const deleteTipoRequisitoDocumento = async (req, res) => {

    try {

        const { id } = req.params;

        await eliminarTipoRequisitoDocumento(
            tipoRequisitoDocumentoRepository,
            archivoRepository,
            id
        );

        return res.json({
            message: "Tipo de requisito documental eliminado correctamente."
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


export const findTipoRequisitoDocumento = async (req, res) => {

    try {

        const { id } = req.params;

        const tipo =
            await getTipoRequisitoDocumento(
                tipoRequisitoDocumentoRepository,
                id
            );

        return res.json(tipo);

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


export const findTiposRequisitoDocumento = async (req, res) => {

    try {

        const tipos =
            await getTiposRequisitoDocumento(
                tipoRequisitoDocumentoRepository
            );

        return res.json(tipos);

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


export const findTiposRequisitoDocumentoByRol = async (req, res) => {

    try {

        const { rol_id } = req.params;

        const tipos =
            await getTiposRequisitoDocumentoByRol(
                tipoRequisitoDocumentoRepository,
                rol_id
            );

        return res.json(tipos);

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