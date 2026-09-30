import { entregaInformeRepository } from "../../infraestructura/repositorios/entregaInformeRepositoryImpl.js";
import { practicaRequisitoDocumentoRepository } from "../../infraestructura/repositorios/practicaRequisitoDocumentoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";

import { crearEntregaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/crearEntregaInforme.js";

import { getEntregaInformeByPracticante } from "../../aplicacion/casos_de_uso/entregaInforme/getEntregasInformeByPracticante.js";

import { getTrazabilidadEntregaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/getTrazabilidadEntregaInforme.js";

import { revisarEntregaInformeTutorDocente } from "../../aplicacion/casos_de_uso/entregaInforme/revisarEntregaInformeTutorDocente.js";

import { revisarEntregaInformeTutorEmpresarial } from "../../aplicacion/casos_de_uso/entregaInforme/revisarEntregaInformeTutorEmpresarial.js";


// ============================================================
// CREAR ENTREGA DE INFORME
// ============================================================

export const createEntregaInforme = async (req, res) => {

    try {

        const user_id = req.user.id;

        const entrega =
            await crearEntregaInforme(
                entregaInformeRepository,
                practicaRequisitoDocumentoRepository,
                archivoRepository,
                user_id,
                req.body,
                req.file
            );

        return res.status(201).json(entrega);

    } catch (error) {

        console.log("Error:", error);

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


// ============================================================
// OBTENER ENTREGA POR PRACTICANTE Y TIPO DE REQUISITO
// ============================================================

export const findEntregaInformeByPracticante = async (req, res) => {

    try {

        const {
            practicante_id,
            tipo_requisito_documento_id
        } = req.params;

        const entrega =
            await getEntregaInformeByPracticante(
                entregaInformeRepository,
                practicante_id,
                tipo_requisito_documento_id
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


// ============================================================
// TRAZABILIDAD DE ENTREGA
// ============================================================

export const findTrazabilidadEntregaInforme = async (req, res) => {

    try {

        const user_id = req.user.id;

        const {
            practicante_id,
            tipo_requisito_documento_id
        } = req.params;

        const trazabilidad =
            await getTrazabilidadEntregaInforme(
                entregaInformeRepository,
                user_id,
                practicante_id,
                tipo_requisito_documento_id
            );

        return res.status(200).json(trazabilidad);

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


// ============================================================
// REVISAR ENTREGA - TUTOR DOCENTE
// ============================================================
export const reviewEntregaInformeTutorDocente = async (req, res) => {

    try {

        const user_id = req.user.id;

        const {
            estado_tutor_docente,
            observacion_tutor_docente
        } = req.body;

        const { id } = req.params;

        const entrega =
            await revisarEntregaInformeTutorDocente(
                entregaInformeRepository,
                id,
                user_id,
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

// ============================================================
// REVISAR ENTREGA - TUTOR EMPRESARIAL
// ============================================================

export const reviewEntregaInformeTutorEmpresarial = async (req, res) => {

    try {

        const user_id = req.user.id;

        const {
            estado_tutor_empresarial,
            observacion_tutor_empresarial
        } = req.body;

        const { id } = req.params;

        const entrega =
            await revisarEntregaInformeTutorEmpresarial(
                entregaInformeRepository,
                id,
                user_id,
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