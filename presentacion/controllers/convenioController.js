import { getConvenios } from "../../aplicacion/casos_de_uso/convenio/getConvenios.js";
import { getConvenio } from "../../aplicacion/casos_de_uso/convenio/getConvenio.js";
import { getConvenioByEmpresa } from "../../aplicacion/casos_de_uso/convenio/getConvenioByEmpresa.js";
import { getConveniosByEmpresa } from "../../aplicacion/casos_de_uso/convenio/getConveniosByEmpresa.js";
import { subirConvenio } from "../../aplicacion/casos_de_uso/convenio/subirConvenio.js";
import { cambiarEstadoConvenio } from "../../aplicacion/casos_de_uso/convenio/actualizarEstadoConvenio.js";
import { aprobarConvenio } from "../../aplicacion/casos_de_uso/convenio/aprobarConvenio.js";

import { convenioRepository } from "../../infraestructura/repositorios/convenioRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { historialConvenioRepository } from "../../infraestructura/repositorios/historialConvenioRepositoryImpl.js";
import { empresaRequisitoDocumentoRepository } from "../../infraestructura/repositorios/empresaRequisitoDocumentoRepositoryImpl.js";
import { tipoRequisitoDocumentoRepository } from "../../infraestructura/repositorios/tipoRequisitoDocumentoRepositoryImpl.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";


const handleError = (error, res) => {

    if (error.statusCode) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Error interno del servidor"
    });

};


export const getConveniosController = async (req, res) => {

    try {

        const convenios = await getConvenios(convenioRepository);

        return res.status(200).json(convenios);

    } catch (error) {
        return handleError(error, res);
    }

};


export const getConvenioController = async (req, res) => {

    try {

        const convenio = await getConvenio(
            convenioRepository,
            req.params.id
        );

        return res.status(200).json(convenio);

    } catch (error) {
        return handleError(error, res);
    }

};


export const getConvenioByEmpresaController = async (req, res) => {

    try {

        const convenio = await getConvenioByEmpresa(
            convenioRepository,
            req.params.empresa_id
        );

        return res.status(200).json(convenio);

    } catch (error) {
        return handleError(error, res);
    }

};


export const getConveniosByEmpresaController = async (req, res) => {

    try {

        const convenios = await getConveniosByEmpresa(
            convenioRepository,
            req.params.empresa_id
        );

        return res.status(200).json(convenios);

    } catch (error) {
        return handleError(error, res);
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
        return handleError(error, res);
    }

};


// Rechazar (y otros estados que no sean APROBADO)
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
        return handleError(error, res);
    }

};


// NUEVO: aprobar con el PDF firmado
export const aprobarConvenioController = async (req, res) => {

    try {

        const convenioAprobado = await aprobarConvenio(
            convenioRepository,
            historialConvenioRepository,
            archivoRepository,
            empresaRequisitoDocumentoRepository,
            tipoRequisitoDocumentoRepository,
            req.params.id,
            req.body,
            req.file
        );

        return res.status(200).json({
            message: "Convenio aprobado correctamente",
            data: convenioAprobado
        });

    } catch (error) {
        return handleError(error, res);
    }

};