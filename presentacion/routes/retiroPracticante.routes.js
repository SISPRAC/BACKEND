import { Router } from "express";

import {
    crearRetiroPracticante,
    listarRetiros,
    obtenerRetiro,
    obtenerRetirosDePracticante
} from "../controllers/retiroPracticanteController.js";
import {upload} from "../middleware/uploadMulter.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();

router.post(
    "/",
    verifyToken,
    verifyRole(["Empresa", "Director de programa"]),
    upload.single("archivo"),
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