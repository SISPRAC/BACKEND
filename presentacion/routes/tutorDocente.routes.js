import { Router } from "express";

import {
    getTutorDocentesController,
    invitarTutorDocenteController,
    getGruposByPracticaController,
    getPracticantesGrupoController
} from "../controllers/tutorDocenteController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();


router.get(
    "/all",
    getTutorDocentesController
);


router.post(
    "/invitacion",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    invitarTutorDocenteController
);


router.get(
    "/practica/:practicaId/grupos",
    verifyToken,
    verifyRole(["Tutor Docente"]),
    getGruposByPracticaController
);


router.get(
    "/:grupoId/practica/:practicaId/practicantes",
    verifyToken,
    verifyRole(["Tutor Docente"]),
    getPracticantesGrupoController
);


export default router;