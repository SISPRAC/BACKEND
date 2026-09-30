import { solicitudVisitaRepository } from "../../infraestructura/repositorios/solicitudVisitaRepositoryImpl.js";
import { solicitudVisitaPracticanteRepository } from "../../infraestructura/repositorios/solicitudVisitaPracticanteRepositoryImpl.js";
import { solicitudVisitaFechaRepository } from "../../infraestructura/repositorios/solicitudVisitaFechaRepositoryImpl.js";
import { practicaPracticanteRepository } from "../../infraestructura/repositorios/practicaPracticanteRepositoryImpl.js";
import { postulacionRepository } from "../../infraestructura/repositorios/postulacionRepositoryImpl.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/TutorDocenteRepositoryImpl.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/tutorEmpresaRepositoryImpl.js";
import { notificacionRepository } from "../../infraestructura/repositorios/notificacionRepositoryImpl.js";
import { visitaRepository } from "../../infraestructura/repositorios/visitaRepositoryImpl.js";

import { crearSolicitudVisita } from "../../aplicacion/casos_de_uso/solicitudVisita/crearSolicitudvisita.js";
import { obtenerSolicitudesVisitaTutorDocente } from "../../aplicacion/casos_de_uso/solicitudVisita/obtenerSolicitudesVisitaTutorDocente.js";
import { obtenerSolicitudesVisitaPorPractica } from "../../aplicacion/casos_de_uso/solicitudVisita/obtenerSolicitudesVisitaPorPractica.js";
import { editarSolicitudVisita } from "../../aplicacion/casos_de_uso/solicitudVisita/editarSolicitudVisita.js";
import { cancelarSolicitudVisita } from "../../aplicacion/casos_de_uso/solicitudVisita/cancelarSolicitudVisita.js";

import { crearNotificacion } from "../../aplicacion/casos_de_uso/notificacion/crearNotificacion.js";

import { crearVisita } from "../../aplicacion/casos_de_uso/solicitudVisita/aceptarSolicitudVisita.js";
import { rechazarSolicitudVisita } from "../../aplicacion/casos_de_uso/solicitudVisita/rechazarSolicitudVisita.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";


// ============================================================
// CREAR SOLICITUD DE VISITA
// ============================================================

export const postSolicitudVisita = async (req, res) => {

    try {

        const user_id = req.user.id;

        const solicitud =
            await crearSolicitudVisita(
                {
                    solicitudVisitaRepository,
                    solicitudVisitaPracticanteRepository,
                    solicitudVisitaFechaRepository,
                    tutorDocenteRepository: TutorDocenteRepository,
                    practicaPracticanteRepository,
                    postulacionRepository,
                    notificacionRepository,
                    crearNotificacion,
                    sequelize
                },
                user_id,
                req.body
            );

        return res.status(201).json(solicitud);

    } catch (error) {

        console.error(error);

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
// OBTENER SOLICITUDES DEL TUTOR DOCENTE AUTENTICADO
// ============================================================

export const getSolicitudesVisitaTutorDocente = async (
    req,
    res
) => {

    try {

        const user_id = req.user.id;

        const solicitudes =
            await obtenerSolicitudesVisitaTutorDocente(
                {
                    tutorDocenteRepository: TutorDocenteRepository,
                    solicitudVisitaRepository
                },
                user_id
            );

        return res.status(200).json(solicitudes);

    } catch (error) {

        console.error(error);

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
// OBTENER SOLICITUDES DE VISITA POR PRÁCTICA
// TUTOR EMPRESARIAL AUTENTICADO
// ============================================================

export const getSolicitudesVisitaPorPractica = async (
    req,
    res
) => {

    try {

        const user_id = req.user.id;

        const { practicaId } = req.params;

        const solicitudes =
            await obtenerSolicitudesVisitaPorPractica(
                {
                    tutorEmpresaRepository,
                    solicitudVisitaRepository
                },
                user_id,
                practicaId
            );

        return res.status(200).json(solicitudes);

    } catch (error) {

        console.error(error);

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
// EDITAR SOLICITUD DE VISITA
// ============================================================

export const putSolicitudVisita = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const solicitud =
            await editarSolicitudVisita(
                {
                    solicitudVisitaRepository,
                    solicitudVisitaFechaRepository,
                    postulacionRepository,
                    notificacionRepository,
                    crearNotificacion,
                    sequelize
                },
                id,
                req.body
            );

        return res.status(200).json(solicitud);

    } catch (error) {

        console.error(error);

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
// CANCELAR SOLICITUD DE VISITA
// ============================================================

export const cancelarSolicitudVisitaController = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const { motivo } = req.body;

        const solicitud =
            await cancelarSolicitudVisita(
                {
                    solicitudVisitaRepository,
                    postulacionRepository,
                    notificacionRepository,
                    crearNotificacion
                },
                id,
                motivo
            );

        return res.status(200).json(solicitud);

    } catch (error) {

        console.error(error);

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
// CREAR VISITA
// TUTOR EMPRESARIAL AUTENTICADO
// ============================================================

export const postVisita = async (
    req,
    res
) => {

    try {

        const usuarioId = req.user.id;

        const visita =
            await crearVisita(
                {
                    visitaRepository,
                    solicitudVisitaRepository,
                    solicitudVisitaFechaRepository,
                    tutorDocenteRepository: TutorDocenteRepository,
                    tutorEmpresaRepository,
                    notificacionRepository,
                    sequelize
                },
                req.body,
                usuarioId
            );

        return res.status(201).json(visita);

    } catch (error) {

        console.error(error);

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
// RECHAZAR SOLICITUD DE VISITA
// TUTOR EMPRESARIAL AUTENTICADO
// ============================================================

export const rechazarSolicitudVisitaController = async (
    req,
    res
) => {

    try {

        const usuarioId = req.user.id;

        const solicitud =
            await rechazarSolicitudVisita(
                {
                    solicitudVisitaRepository,
                    tutorDocenteRepository: TutorDocenteRepository,
                    tutorEmpresaRepository,
                    notificacionRepository,
                    sequelize
                },
                req.body,
                usuarioId
            );

        return res.status(200).json(solicitud);

    } catch (error) {

        console.error(error);

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
