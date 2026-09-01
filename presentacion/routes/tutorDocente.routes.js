import { Router } from "express";
import {
    getTutorDocentesController,
    invitarTutorDocenteController
} from "../controllers/tutorDocenteController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();

router.get("/all", getTutorDocentesController);

router.post(
    "/invitacion",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    invitarTutorDocenteController
);

export default router;
