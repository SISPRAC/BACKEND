import { Router } from "express";
import {
    getTutorEmpresarialController,
    invitarTutorEmpresarialController
} from "../controllers/tutorEmpresarialController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();

router.get("/all", verifyToken, getTutorEmpresarialController);

router.post(
    "/invitacion",
    verifyToken,
    verifyRole(["Empresa"]),
    invitarTutorEmpresarialController
);

export default router;
