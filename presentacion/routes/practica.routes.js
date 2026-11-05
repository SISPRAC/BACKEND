import { Router } from "express";

import {
    CrearPracticaController,
    eliminarPracticaController,
    obtenerPracticasController,
    obtenerPracticaPorIdController,
    obtenerPracticaPorPeriodoController,
    actualizarPracticaController,
    actualizarArlPracticaController
} from "../controllers/practicaController.js";

import { upload } from "../middleware/uploadMulter.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();


router.get(
    "/all",
    verifyToken,
    obtenerPracticasController
);


router.post(
    "/crear",
    verifyToken,
    CrearPracticaController
);


router.delete(
    "/:id",
    verifyToken,
    eliminarPracticaController
);


router.get(
    "/:id",
    verifyToken,
    obtenerPracticaPorIdController
);


router.get(
    "/periodo/:periodo_id",
    verifyToken,
    obtenerPracticaPorPeriodoController
);


router.put(
    "/:id",
    verifyToken,
    actualizarPracticaController
);


// Subir / actualizar ARL de una práctica
router.put(
    "/:id/arl",
    verifyToken,
    upload.single("archivo"),
    actualizarArlPracticaController
);


export default router;