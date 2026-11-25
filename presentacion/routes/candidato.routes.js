import express from "express";

import {
    registerCandidatoController,
    updateCandidatoController,
    getCandidatosController,
    getCandidatosDisponiblesController,
    getCandidatosPerfilController,
    invitarCandidatoController,
    invitarCandidatosMasivoController,
    obtenerCandidatosParaReportePorPeriodoController,
    verificarCandidatosPdfController,
    getMiPerfilProfesionalController,
    updateMiPerfilProfesionalController
} from "../controllers/candidatoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";
import { verifyInvitationToken } from "../middleware/invitationMiddleware.js";

import { upload } from "../middleware/uploadMulter.js";

const router = express.Router();

router.post(
    "/registrarCandidato",
    upload.single("cv"),
    verifyInvitationToken,
    registerCandidatoController
);

router.post(
    "/invitacion",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    invitarCandidatoController
);

router.post(
    "/invitacion/masiva",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    invitarCandidatosMasivoController
);

router.post(
    "/verificar-pdf",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    verificarCandidatosPdfController
);

router.get("/mi-perfil-profesional", verifyToken,
    verifyRole(["Candidato", "Practicante"]), getMiPerfilProfesionalController);

router.put("/mi-perfil-profesional", verifyToken,
    verifyRole(["Candidato", "Practicante"]), updateMiPerfilProfesionalController);

router.put(
    "/:id",
    verifyToken,
    upload.single("cv"),
    updateCandidatoController
);

router.get(
    "/all",
    verifyToken,
    getCandidatosController
);

router.get(
    "/disponibles",
    verifyToken,
    getCandidatosDisponiblesController
);

router.get(
    "/perfil/:perfilNombre",
    verifyToken,
    getCandidatosPerfilController
);

router.get(
    "/reporte/periodo/:periodo_id",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    obtenerCandidatosParaReportePorPeriodoController
);

export default router;