import { entregaInformeRepository } from "../../infraestructura/repositorios/entregaInformeRepositoryImpl.js";
import { practicaInformeRepository } from "../../infraestructura/repositorios/practicaInformeRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { crearEntregaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/crearEntregaInforme.js";
import { revisarEntregaInformeTutorDocente } from "../../aplicacion/casos_de_uso/entregaInforme/revisarEntregaInformeTutorDocente.js";
import { revisarEntregaInformeTutorEmpresarial } from "../../aplicacion/casos_de_uso/entregaInforme/revisarEntregaInformeTutorEmpresarial.js";

import { getEntregaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/getEntregaInforme.js";
import { getEntregasInformeByPracticaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/getEntregasInformeByPracticaInforme.js";
import { getEntregasInformeByPracticaPracticante } from "../../aplicacion/casos_de_uso/entregaInforme/getEntregasInformeByPracticaPracticante.js";
import { getEntregasInformeByPracticaPracticanteAndInforme } from "../../aplicacion/casos_de_uso/entregaInforme/getEntregasInformeByPracticaPracticanteAndInforme.js";


export const createEntregaInforme = async (req, res) => {

    try {

        const entrega =
            await crearEntregaInforme(
                entregaInformeRepository,
                practicaInformeRepository,
                archivoRepository,
                req.body,
                req.file
            );

        return res.status(201).json(entrega);

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


export const findEntregaInforme = async (req, res) => {

    try {

        const { id } = req.params;

        const entrega =
            await getEntregaInforme(
                entregaInformeRepository,
                id
            );

        return res.status(200).json(entrega);

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


export const findEntregasInformeByPracticaInforme = async (req, res) => {

    try {

        const { practica_informe_id } = req.params;

        const entregas =
            await getEntregasInformeByPracticaInforme(
                entregaInformeRepository,
                practica_informe_id
            );

        return res.status(200).json(entregas);

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


export const findEntregasInformeByPracticaPracticante = async (req, res) => {

    try {

        const { practica_practicante_id } = req.params;

        const entregas =
            await getEntregasInformeByPracticaPracticante(
                entregaInformeRepository,
                practica_practicante_id
            );

        return res.status(200).json(entregas);

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


export const findEntregasInformeByPracticaPracticanteAndInforme = async (req, res) => {

    try {

        const {
            practica_practicante_id,
            practica_informe_id
        } = req.params;

        const entregas =
            await getEntregasInformeByPracticaPracticanteAndInforme(
                entregaInformeRepository,
                practica_practicante_id,
                practica_informe_id
            );

        return res.status(200).json(entregas);

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


export const reviewEntregaInformeTutorDocente = async (req, res) => {

    try {

        const {
            tutor_docente_id,
            estado_tutor_docente,
            observacion_tutor_docente
        } = req.body;

        const { id } = req.params;

        const entrega =
            await revisarEntregaInformeTutorDocente(
                entregaInformeRepository,
                id,
                tutor_docente_id,
                estado_tutor_docente,
                observacion_tutor_docente
            );

        return res.status(200).json(entrega);

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


export const reviewEntregaInformeTutorEmpresarial = async (req, res) => {

    try {

        const {
            tutor_empresarial_id,
            estado_tutor_empresarial,
            observacion_tutor_empresarial
        } = req.body;

        const { id } = req.params;

        const entrega =
            await revisarEntregaInformeTutorEmpresarial(
                entregaInformeRepository,
                id,
                tutor_empresarial_id,
                estado_tutor_empresarial,
                observacion_tutor_empresarial
            );

        return res.status(200).json(entrega);

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