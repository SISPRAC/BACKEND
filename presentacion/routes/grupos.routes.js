
import express from "express";

import {
    CrearGrupoController,
    getGruposController,
    getGrupoController,
    getCandidatosByGrupoController,
    getGruposByPracticaIdController,
    getPracticantesDocumentosByGrupoController,
    EditarGrupoController,
    deleteGrupoController
} from "../controllers/grupoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// =============================
// CREAR GRUPO
// =============================

router.post(
    "/crear",
    verifyToken,
    CrearGrupoController
);

// =============================
// OBTENER TODOS LOS GRUPOS
// =============================

router.get(
    "/all",
    verifyToken,
    getGruposController
);

// =============================
// OBTENER GRUPOS POR PRÁCTICA
// =============================

router.get(
    "/practica/:practica_id",
    verifyToken,
    getGruposByPracticaIdController
);

// =============================
// OBTENER CANDIDATOS DEL GRUPO
// =============================

router.get(
    "/:id/candidatos",
    verifyToken,
    getCandidatosByGrupoController
);

// =============================
// OBTENER DOCUMENTOS DE PRACTICANTES POR GRUPO
// =============================

router.get(
    "/:id/documentos-practicantes",
    verifyToken,
    getPracticantesDocumentosByGrupoController
);

// =============================
// OBTENER UN GRUPO
// =============================

router.get(
    "/:id",
    verifyToken,
    getGrupoController
);

// =============================
// EDITAR GRUPO
// =============================

router.put(
    "/:id",
    verifyToken,
    EditarGrupoController
);

// =============================
// ELIMINAR GRUPO
// =============================

router.delete(
    "/:id",
    verifyToken,
    deleteGrupoController
);

export default router;
