import { Router } from "express";

import {
    getPracticantesController,
    obtenerPracticaPracticanteController,
    obtenerPracticantesPorPracticaController
} from "../controllers/practicanteController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
    "/all",
    verifyToken,
    getPracticantesController
);

router.get(
    "/mi-practica",
    verifyToken,
    obtenerPracticaPracticanteController
);

router.get(
    "/practica/:practicaId",
    verifyToken,
    obtenerPracticantesPorPracticaController
);

export default router;
