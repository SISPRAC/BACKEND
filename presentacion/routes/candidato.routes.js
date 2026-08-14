import express from "express";

import {
    registerCandidatoController,
    updateCandidatoController,
    getCandidatosController,
    getCandidatosDisponiblesController,
    getCandidatosPerfilController
} from "../controllers/candidatoController.js";

import {upload} from "../middleware/uploadMulter.js";

const router = express.Router();

router.post(
    "/registrarCandidato",
    upload.single("cv"),
    registerCandidatoController
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