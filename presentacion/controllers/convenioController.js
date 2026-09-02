import { getConvenios } from "../../aplicacion/casos_de_uso/convenio/getConvenios.js";
import { getConvenio } from "../../aplicacion/casos_de_uso/convenio/getConvenio.js";
import { getConvenioByEmpresa } from "../../aplicacion/casos_de_uso/convenio/getConvenioByEmpresa.js";
import { getConveniosByEmpresa } from "../../aplicacion/casos_de_uso/convenio/getConveniosByEmpresa.js";
import { subirConvenio } from "../../aplicacion/casos_de_uso/convenio/subirConvenio.js";
import { cambiarEstadoConvenio } from "../../aplicacion/casos_de_uso/convenio/actualizarEstadoConvenio.js";

import { convenioRepository } from "../../infraestructura/repositorios/convenioRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { historialConvenioRepository } from "../../infraestructura/repositorios/historialConvenioRepositoryImpl.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";


export const getConveniosController = async (req, res) => {

    try {

        const convenios = await getConvenios(
            convenioRepository
        );

        return res.status(200).json(convenios);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


export const getConvenioController = async (req, res) => {

    try {

        const convenioId = req.params.id;

        const convenio = await getConvenio(
            convenioRepository,
            convenioId
        );

        return res.status(200).json(convenio);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


export const getConvenioByEmpresaController = async (req, res) => {

    try {

        const empresaId = req.params.empresa_id;

        const convenio = await getConvenioByEmpresa(
            convenioRepository,
            empresaId
        );

        return res.status(200).json(convenio);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


export const getConveniosByEmpresaController = async (req, res) => {

    try {

        const empresaId = req.params.empresa_id;

        const convenios = await getConveniosByEmpresa(
            convenioRepository,
            empresaId
        );

        return res.status(200).json(convenios);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


export const subirConvenioController = async (req, res) => {

    try {

        const convenio = await subirConvenio(
            sequelize,
            convenioRepository,
            archivoRepository,
            historialConvenioRepository,
            {
                convenio_id: req.body.convenio_id,
                modo: req.body.modo,
                empresa_id: req.body.empresa_id,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                usuario_id: req.body.usuario_id,

                buffer: req.file?.buffer,
                nombreArchivo: req.file?.originalname,
                mimeType: req.file?.mimetype,

                carpeta: "convenios"
            }
        );

        return res.status(200).json({
            message: "Convenio cargado correctamente",
            data: convenio
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


export const actualizarEstadoConvenioController = async (req, res) => {

    try {

        const convenioActualizado = await cambiarEstadoConvenio(
            convenioRepository,
            historialConvenioRepository,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Estado del convenio actualizado correctamente",
            data: convenioActualizado
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};