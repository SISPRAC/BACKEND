import { Router } from "express";

import {
    registrarPostulacionesController,
    eliminarPostulacionController,
    obtenerCandidatosEmpresaController,
    aceptarPostulacionController,
    rechazarPostulacionController
} from "../controllers/postulacionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
    "/crear",
    registrarPostulacionesController
);

router.delete(
    "/apertura/:aperturaVacanteId/candidato/:candidatoId",
    eliminarPostulacionController
);

router.get(
    "/empresa/candidatos",
    verifyToken,
    obtenerCandidatosEmpresaController
);

router.patch(
    "/:postulacionId/aceptar",
    verifyToken,
    aceptarPostulacionController
);

router.patch(
    "/:postulacionId/rechazar",
    verifyToken,
    rechazarPostulacionController
);

export default router;