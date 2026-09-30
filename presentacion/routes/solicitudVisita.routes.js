import { Router } from "express";

import {

    postSolicitudVisita,

    getSolicitudesVisitaTutorDocente,

    getSolicitudesVisitaPorPractica,

    putSolicitudVisita,

    cancelarSolicitudVisitaController,

    postVisita,

    rechazarSolicitudVisitaController

} from "../controllers/solicitudVisitaController.js";

import { verifyToken } from "../middleware/authMiddleware.js";


const router = Router();


// ============================================================
// CREAR SOLICITUD DE VISITA
// ============================================================

router.post(
    "/",
    verifyToken,
    postSolicitudVisita
);


// ============================================================
// OBTENER SOLICITUDES DEL TUTOR DOCENTE AUTENTICADO
// ============================================================

router.get(
    "/mis-solicitudes",
    verifyToken,
    getSolicitudesVisitaTutorDocente
);


// ============================================================
// OBTENER SOLICITUDES DE VISITA POR PRÁCTICA
// TUTOR EMPRESARIAL AUTENTICADO
// ============================================================

router.get(
    "/practica/:practicaId",
    verifyToken,
    getSolicitudesVisitaPorPractica
);


// ============================================================
// RECHAZAR SOLICITUD DE VISITA
// TUTOR EMPRESARIAL AUTENTICADO
// ============================================================

router.put(
    "/rechazar",
    verifyToken,
    rechazarSolicitudVisitaController
);

// ============================================================
// EDITAR SOLICITUD DE VISITA
// ============================================================

router.put(
    "/:id",
    verifyToken,
    putSolicitudVisita
);


// ============================================================
// CANCELAR SOLICITUD DE VISITA
// ============================================================

router.put(
    "/:id/cancelar",
    verifyToken,
    cancelarSolicitudVisitaController
);


// ============================================================
// ACEPTAR SOLICITUD Y CREAR VISITA
// TUTOR EMPRESARIAL AUTENTICADO
// ============================================================

router.post(
    "/crear-visita",
    verifyToken,
    postVisita
);


export default router;