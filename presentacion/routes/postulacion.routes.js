import { Router } from "express";
import {
    registrarPostulacionesController,
    eliminarPostulacionController,
    obtenerCandidatosEmpresaController
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

export default router;