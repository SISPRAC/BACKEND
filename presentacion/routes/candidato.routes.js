
import express from "express";

import {
    registerCandidatoController,
    updateCandidatoController,
    getCandidatosController,
    getCandidatosDisponiblesController,
    getCandidatosPerfilController,
    invitarCandidatoController
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


router.post("/invitacion",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    invitarCandidatoController
);


router.put(
    "/:id",
    upload.single("cv"),
    updateCandidatoController
);


router.get(
    "/all",
    getCandidatosController
);


router.get(
    "/disponibles",
    getCandidatosDisponiblesController
);


router.get(
    "/perfil/:perfilNombre",
    getCandidatosPerfilController
);


export default router;

