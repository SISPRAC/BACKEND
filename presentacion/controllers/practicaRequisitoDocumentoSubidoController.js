
import { practicaRequisitoDocumentoSubidoRepository } from "../../infraestructura/repositorios/practicaRequisitoDocumentoSubidoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { sequelize } from "../../infraestructura/database/dbConnection.js";

import { subirPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/subirPracticaRequisitoDocumento.js"
import { obtenerEstadoPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/obtenerEstadoPracticaRequisitoDocumento.js";
import { obtenerPracticaRequisitoDocumentoPorId } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/obtenerPracticaRequisitoDocumentoPorId.js";
import { editarPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/editarPracticaRequisitoDocumento.js";
import { obtenerDocumentosPracticantePorPractica } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/obtenerDocumentosPracticantePorPractica.js";

import { getDocumentosEmpresaPorPractica } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/getDocumentosEmpresaPorPractica.js";

import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";
import { practicaRepository } from "../../infraestructura/repositorios/practicaRepositoryImpl.js";

import { getEmpresasDocumentosByPractica } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/getEmpresasDocumentosByPractica.js";

import { aprobarPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/aprobarPracticaRequisitoDocumento.js";
import { rechazarPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumentoSubido/rechazarPracticaRequisitoDocumento.js";

export const createPracticaRequisitoDocumentoSubido = async (req, res) => {

    try {

        const documento =
            await subirPracticaRequisitoDocumento(
                sequelize,
                practicaRequisitoDocumentoSubidoRepository,
                archivoRepository,
                {
                    usuario_id: req.user.id,
                    practica_requisito_documento_id:
                        req.body.practica_requisito_documento_id,
                    fecha_vencimiento:
                        req.body.fecha_vencimiento,

                    buffer: req.file?.buffer,
                    nombreArchivo: req.file?.originalname,
                    mimeType: req.file?.mimetype,

                    carpeta: "documentos-requisitos"
                }
            );

        return res.status(201).json({
            message: "Documento de requisito subido correctamente",
            data: documento
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

export const updatePracticaRequisitoDocumentoSubido = async (req, res) => {
    try {
        const documento = await editarPracticaRequisitoDocumento(
            sequelize,
            practicaRequisitoDocumentoSubidoRepository,
            archivoRepository,
            {
                usuario_id: req.user.id,
                practica_requisito_documento_id:
                    req.body.practica_requisito_documento_id,
                fecha_vencimiento:
                    req.body.fecha_vencimiento,

                buffer: req.file?.buffer,
                nombreArchivo: req.file?.originalname,
                mimeType: req.file?.mimetype,

                carpeta: "documentos-requisitos",
            }
        );

        return res.status(200).json({
            message: "Documento de requisito actualizado correctamente",
            data: documento,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error(
            "Error al editar documento de requisito:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};

export const findDocumentosPracticantePorPractica = async (req, res) => {
    try {
        const { usuario_id, practica_id } = req.params;

        const documentos =
            await obtenerDocumentosPracticantePorPractica(
                {
                    practicaRequisitoDocumentoSubidoRepository,
                },
                usuario_id,
                practica_id
            );

        return res.status(200).json({
            message: "Documentos obtenidos correctamente",
            data: documentos,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error(
            "Error al obtener documentos del practicante por práctica:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};

export const findEstadoPracticaRequisitoDocumento = async (req, res) => {

    try {

        const documentos =
            await obtenerEstadoPracticaRequisitoDocumento(
                {
                    practicaRequisitoDocumentoSubidoRepository
                },
                req.user.id
            );

        return res.status(200).json(documentos);

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

export const findPracticaRequisitoDocumentoSubido = async (req, res) => {

    try {

        const { id } = req.params;

        const documento =
            await obtenerPracticaRequisitoDocumentoPorId(
                {
                    practicaRequisitoDocumentoSubidoRepository
                },
                id
            );

        return res.status(200).json(documento);

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

export const aprobarDocumentoRequisito = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await aprobarPracticaRequisitoDocumento(
            {
                practicaRequisitoDocumentoSubidoRepository,
            },
            id,
            req.user.id
        );

        return res.status(200).json({
            message: "Documento aprobado correctamente",
            data: documento,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error("Error al aprobar documento de requisito:", error);

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};

export const findEmpresasDocumentosPorPractica = async (req, res) => {
    try {
        const { practica_id } = req.params;

        const empresas = await getEmpresasDocumentosByPractica(
            {
                empresaRepository,
                practicaRepository,
            },
            practica_id
        );

        return res.status(200).json({
            message: "Empresas y documentos obtenidos correctamente",
            data: empresas,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error(
            "Error al obtener empresas y documentos por práctica:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};

export const rechazarDocumentoRequisito = async (req, res) => {
    try {
        const { id } = req.params;
        const { observacion } = req.body;

        const documento = await rechazarPracticaRequisitoDocumento(
            {
                practicaRequisitoDocumentoSubidoRepository,
            },
            id,
            req.user.id,
            observacion
        );

        return res.status(200).json({
            message: "Documento rechazado correctamente",
            data: documento,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error("Error al rechazar documento de requisito:", error);

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};

export const findDocumentosEmpresaPorPractica = async (req, res) => {
    try {
        const { usuario_id, practica_id } = req.params;

        if (!usuario_id || !practica_id) {
            return res.status(400).json({
                message: "El usuario y la práctica son obligatorios.",
            });
        }

        const documentos = await getDocumentosEmpresaPorPractica(
            {
                practicaRequisitoDocumentoSubidoRepository,
            },
            usuario_id,
            practica_id
        );

        return res.status(200).json({
            message: "Documentos de la empresa obtenidos correctamente",
            data: documentos,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error(
            "Error al obtener documentos de la empresa por práctica:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};


