import { tipoRequisitoDocumentoRepository } from "../../infraestructura/repositorios/tipoRequisitoDocumentoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { crearTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/crearTipoRequisitoDocumento.js";
import { actualizarTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/actualizarTipoRequisitoDocumento.js";
import { eliminarTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/eliminarTipoRequisitoDocumento.js";
import { getTipoRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getTipoRequisitoDocumento.js";
import { getTiposRequisitoDocumento } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getTiposRequisitoDocumento.js";
import { getTiposRequisitoDocumentoByRol } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getTiposRequisitoDocumentoByRol.js";
import { getRequisitosConvenio } from "../../aplicacion/casos_de_uso/tipoRequisitoDocumento/getRequisitosConvenio.js";


const normalizarTipoEmpresa = (valor) =>
    valor === "publica" || valor === "privada" ? valor : null;


// Maneja los errores en un solo lugar y deja el error real en la consola
const handleError = (error, res) => {

    if (error.statusCode) {

        return res.status(error.statusCode).json({
            message: error.message
        });

    }

    console.error("Error en tipoRequisitoDocumentoController:", error);

    return res.status(500).json({
        message: "Error interno del servidor"
    });

};


export const createTipoRequisitoDocumento = async (req, res) => {

    try {

        const data = {
            ...req.body,
            es_requisito_convenio: req.body.es_requisito_convenio === "true",
            tipo_empresa: normalizarTipoEmpresa(req.body.tipo_empresa)
        };

        const tipo =
            await crearTipoRequisitoDocumento(
                tipoRequisitoDocumentoRepository,
                archivoRepository,
                data,
                req.file
            );

        return res.status(201).json(tipo);

    } catch (error) {

        return handleError(error, res);

    }

};


export const updateTipoRequisitoDocumento = async (req, res) => {

    try {

        const data = { ...req.body };

        if (req.body.es_requisito_convenio !== undefined) {
            data.es_requisito_convenio = req.body.es_requisito_convenio === "true";
        }

        if (req.body.tipo_empresa !== undefined) {
            data.tipo_empresa = normalizarTipoEmpresa(req.body.tipo_empresa);
        }

        const tipo =
            await actualizarTipoRequisitoDocumento(
                tipoRequisitoDocumentoRepository,
                archivoRepository,
                req.params.id,
                data,
                req.file
            );

        return res.status(200).json(tipo);

    } catch (error) {

        return handleError(error, res);

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

        return handleError(error, res);

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

        return handleError(error, res);

    }

};


export const findTiposRequisitoDocumento = async (req, res) => {

    try {

        const { es_requisito_convenio, tipo_empresa } = req.query;

        const tipos =
            es_requisito_convenio === "true"
                ? await getRequisitosConvenio(
                    tipoRequisitoDocumentoRepository,
                    normalizarTipoEmpresa(tipo_empresa) ?? undefined
                )
                : await getTiposRequisitoDocumento(
                    tipoRequisitoDocumentoRepository
                );

        return res.json(tipos);

    } catch (error) {

        return handleError(error, res);

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

        return handleError(error, res);

    }

};