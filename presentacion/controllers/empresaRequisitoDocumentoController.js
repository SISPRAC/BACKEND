import { empresaRequisitoDocumentoRepository } from "../../infraestructura/repositorios/empresaRequisitoDocumentoRepositoryImpl.js";
import { tipoRequisitoDocumentoRepository } from "../../infraestructura/repositorios/tipoRequisitoDocumentoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { getDocumentosConvenioEmpresa } from "../../aplicacion/casos_de_uso/empresaRequisitoDocumento/getDocumentosConvenioEmpresa.js";
import { subirDocumentoConvenioEmpresa } from "../../aplicacion/casos_de_uso/empresaRequisitoDocumento/subirDocumentoConvenioEmpresa.js";
import { reemplazarDocumentoConvenioEmpresa } from "../../aplicacion/casos_de_uso/empresaRequisitoDocumento/reemplazarDocumentoConvenioEmpresa.js";
import { obtenerRevisionRequisitosEmpresa } from "../../aplicacion/casos_de_uso/empresaRequisitoDocumento/obtenerRevisionRequisitosEmpresa.js";
import { revisarDocumentoConvenioEmpresa } from "../../aplicacion/casos_de_uso/empresaRequisitoDocumento/revisarDocumentoConvenioEmpresa.js";


const handleError = (error, res) => {

    if (error.statusCode) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    console.error("Error en empresaRequisitoDocumentoController:", error);

    return res.status(500).json({
        message: "Error interno del servidor"
    });

};


// Empresa: sus documentos subidos
export const findDocumentosConvenioEmpresa = async (req, res) => {

    try {

        const docs = await getDocumentosConvenioEmpresa(
            empresaRequisitoDocumentoRepository,
            req.params.empresa_id
        );

        return res.json(docs);

    } catch (error) {
        return handleError(error, res);
    }

};


// Empresa: subir por primera vez
export const uploadDocumentoConvenioEmpresa = async (req, res) => {

    try {

        const registro = await subirDocumentoConvenioEmpresa(
            empresaRequisitoDocumentoRepository,
            archivoRepository,
            req.body,
            req.file
        );

        return res.status(201).json(registro);

    } catch (error) {
        return handleError(error, res);
    }

};


// Empresa: reemplazar uno pendiente o rechazado
export const replaceDocumentoConvenioEmpresa = async (req, res) => {

    try {

        const registro = await reemplazarDocumentoConvenioEmpresa(
            empresaRequisitoDocumentoRepository,
            archivoRepository,
            req.body,
            req.file
        );

        return res.status(200).json(registro);

    } catch (error) {
        return handleError(error, res);
    }

};


// NUEVO - Director: requisitos de una empresa con su documento
export const findRevisionRequisitosEmpresa = async (req, res) => {

    try {

        const revision = await obtenerRevisionRequisitosEmpresa(
            empresaRequisitoDocumentoRepository,
            tipoRequisitoDocumentoRepository,
            req.params.empresa_id
        );

        return res.json(revision);

    } catch (error) {
        return handleError(error, res);
    }

};


// NUEVO - Director: aprobar o rechazar un documento
export const reviewDocumentoConvenioEmpresa = async (req, res) => {

    try {

        const registro = await revisarDocumentoConvenioEmpresa(
            empresaRequisitoDocumentoRepository,
            req.params.id,
            req.body
        );

        return res.status(200).json(registro);

    } catch (error) {
        return handleError(error, res);
    }

};