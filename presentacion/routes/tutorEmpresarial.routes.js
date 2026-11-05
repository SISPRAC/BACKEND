import { Router } from "express";

import {
    getTutorEmpresarialController,
    invitarTutorEmpresarialController,
    getAperturasByTutorEmpresaController,
    getAperturasByPracticaController
} from "../controllers/tutorEmpresarialController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();

router.get(
    "/all",
    verifyToken,
    getTutorEmpresarialController
);

router.post(
    "/invitacion",
    verifyToken,
    verifyRole(["Empresa"]),
    invitarTutorEmpresarialController
);

router.get(
    "/mis-aperturas",
    verifyToken,
    verifyRole(["Tutor Empresarial"]),
    getAperturasByTutorEmpresaController
);

router.get(
    "/mis-aperturas/:practicaId",
    verifyToken,
    verifyRole(["Tutor Empresarial"]),
    getAperturasByPracticaController
);

export default router;