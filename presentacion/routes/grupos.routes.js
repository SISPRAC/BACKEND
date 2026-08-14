import express from "express";

import {
    CrearGrupoController,
    getGruposController,
    getGrupoController,
    getCandidatosByGrupoController,
    EditarGrupoController,
    deleteGrupoController
} from "../controllers/grupoController.js";


const router = express.Router();


// =============================
// CREAR GRUPO
// =============================

router.post(
    "/crear",
    CrearGrupoController
);


// =============================
// OBTENER TODOS LOS GRUPOS
// =============================

router.get(
    "/all",
    getGruposController
);


// =============================
// OBTENER CANDIDATOS DEL GRUPO
// =============================

router.get(
    "/:id/candidatos",
    getCandidatosByGrupoController
);


// =============================
// OBTENER UN GRUPO
// =============================

router.get(
    "/:id",
    getGrupoController
);


// =============================
// EDITAR GRUPO
// =============================

router.put(
    "/:id",
    EditarGrupoController
);


// =============================
// ELIMINAR GRUPO
// =============================

router.delete(
    "/:id",
    deleteGrupoController
);


export default router;