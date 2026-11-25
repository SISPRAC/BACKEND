import { entregaInformeRepository } from "../../infraestructura/repositorios/entregaInformeRepositoryImpl.js";
import { practicaRequisitoDocumentoRepository } from "../../infraestructura/repositorios/practicaRequisitoDocumentoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";

import { crearEntregaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/crearEntregaInforme.js";

import { getEntregaInformeByPracticante } from "../../aplicacion/casos_de_uso/entregaInforme/getEntregasInformeByPracticante.js";

import { getTrazabilidadEntregaInforme } from "../../aplicacion/casos_de_uso/entregaInforme/getTrazabilidadEntregaInforme.js";

import { revisarEntregaInformeTutorDocente } from "../../aplicacion/casos_de_uso/entregaInforme/revisarEntregaInformeTutorDocente.js";

import { revisarEntregaInformeTutorEmpresarial } from "../../aplicacion/casos_de_uso/entregaInforme/revisarEntregaInformeTutorEmpresarial.js";
import { notificacionRepository } from "../../infraestructura/repositorios/notificacionRepositoryImpl.js"

import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";
// ============================================================
// CREAR ENTREGA DE INFORME
// ============================================================

export const createEntregaInforme = async (req, res) => {

    try {
        const entrega =
            await crearEntregaInforme(
                entregaInformeRepository,
                practicaRequisitoDocumentoRepository,
                archivoRepository,
                req.user.id,
                req.body,
                req.file,
                notificacionRepository
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

        // El practicante se toma del token (user_id), no de la URL:
        // así nadie puede ver la trazabilidad de otro practicante.
        const { tipo_requisito_documento_id } = req.params;

        const trazabilidad =
            await getTrazabilidadEntregaInforme(
                entregaInformeRepository,
                practicaRequisitoDocumentoRepository,
                user_id,
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

        const entrega =
            await revisarEntregaInformeTutorDocente(
                req.params.id,
                req.user.id,
                req.body.estado_tutor_docente,
                req.body.observacion_tutor_docente,
                {
                    entregaInformeRepository,
                    TutorDocenteRepository,
                    notificacionRepository
                }
            );

        return res.status(200).json(entrega);

    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });

        }

        console.log("Error al revisar entrega:", error);

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


        const entrega =
            await revisarEntregaInformeTutorEmpresarial(
                req.params.id,
                req.user.id,
                req.body.estado_tutor_empresarial,
                req.body.observacion_tutor_empresarial,
                {
                    entregaInformeRepository,
                    tutorEmpresaRepository,
                    notificacionRepository
                }
            );

        return res.status(200).json(entrega);

    } catch (error) {

        console.log("Error revision", error);

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