import { practicaRequisitoDocumentoRepository } from "../../infraestructura/repositorios/practicaRequisitoDocumentoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { crearPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumento/crearPracticaRequisitoDocumento.js";
import { actualizarPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumento/actualizarPracticaRequisitoDocumento.js";
import { eliminarPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumento/eliminarPracticaRequisitoDocumento.js";
import { getPracticaRequisitoDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumento/getPracticaRequisitoDocumento.js";
import { getPracticaRequisitosDocumento } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumento/getPracticaRequisitosDocumento.js";
import { getPracticaRequisitosDocumentoByRol } from "../../aplicacion/casos_de_uso/practicaRequisitoDocumento/getPracticaRequisitosDocumentoByRol.js";

export const createPracticaRequisitoDocumento = async (req, res) => {

    try {

        const requisito =
            await crearPracticaRequisitoDocumento(
                practicaRequisitoDocumentoRepository,
                req.body
            );

        res.status(201).json(requisito);

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

export const updatePracticaRequisitoDocumento = async (req, res) => {

    try {

        const requisito =
            await actualizarPracticaRequisitoDocumento(
                practicaRequisitoDocumentoRepository,
                archivoRepository,
                req.params.id,
                req.body,
                req.file
            );

        return res.status(200).json(requisito);

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

export const deletePracticaRequisitoDocumento = async (req, res) => {
    try {

        const { id } = req.params;

        await eliminarPracticaRequisitoDocumento(
            practicaRequisitoDocumentoRepository,
            archivoRepository,
            req.params.id
        );

        return res.json({
            message: "Requisito documental eliminado correctamente.",
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

export const findPracticaRequisitoDocumento = async (req, res) => {
    try {

        const { id } = req.params;

        const requisito = await getPracticaRequisitoDocumento(
            practicaRequisitoDocumentoRepository,
            id
        );

        return res.json(requisito);

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

export const findPracticaRequisitosDocumento = async (req, res) => {
    try {

        const { practica_id } = req.params;

        const requisitos = await getPracticaRequisitosDocumento(
            practicaRequisitoDocumentoRepository,
            practica_id
        );

        return res.json(requisitos);

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

export const findPracticaRequisitosDocumentoByRol = async (req, res) => {
    try {

        const { practica_id, rol_id } = req.params;

        const requisitos = await getPracticaRequisitosDocumentoByRol(
            practicaRequisitoDocumentoRepository,
            practica_id,
            rol_id
        );

        return res.json(requisitos);

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

