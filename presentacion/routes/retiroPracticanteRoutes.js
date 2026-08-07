import { Router } from "express";

import {
    crearRetiroPracticante,
    listarRetiros,
    obtenerRetiro,
    obtenerRetirosDePracticante
} from "../controllers/retiroPracticanteController.js";
import {upload} from "../../presentacion/middleware/uploadMulter.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
    "/",
    verifyToken,
    upload.single("cv"),
    crearRetiroPracticante
);

router.get(
    "/",
    verifyToken,
    listarRetiros
);

router.get(
    "/practicante/:practicanteId",
    verifyToken,
    obtenerRetirosDePracticante
);

router.get(
    "/:id",
    verifyToken,
    obtenerRetiro
);

export default router;