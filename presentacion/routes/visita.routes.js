import { Router } from "express";

import {
    actualizarVisitaController,
    obtenerVisitaController,
    obtenerVisitaPorSolicitudController,
    obtenerVisitasPorPracticanteController
} from "../controllers/visitaController.js";

import { uploadVisita } from "../middleware/uploadMulter.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();


// Obtener visita por su propio ID
router.get(
    "/:id",
    verifyToken,
    verifyRole(["Tutor Docente"]),
    obtenerVisitaController
);


// Obtener visita mediante el ID de la solicitud
router.get(
    "/solicitud/:solicitudVisitaId",
    verifyToken,
    verifyRole(["Tutor Empresarial"]),
    obtenerVisitaPorSolicitudController
);


// Obtener visitas mediante el ID del practicante
router.get(
    "/practicante/:practicanteId",
    verifyToken,
    verifyRole(["Director de programa"]),
    obtenerVisitasPorPracticanteController
);


// Actualizar / completar visita
router.put(
    "/:id",
    verifyToken,
    verifyRole(["Tutor Docente"]),
    uploadVisita.fields([
        {
            name: "fotos",
            maxCount: 3
        },
        {
            name: "acta",
            maxCount: 1
        }
    ]),
    actualizarVisitaController
);


export default router;
