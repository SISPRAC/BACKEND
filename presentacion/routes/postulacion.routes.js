import { Router } from "express";
import {registrarPostulacionesController , eliminarPostulacionController} from "../controllers/postulacionController.js"

const router = Router();

router.post("/crear", registrarPostulacionesController);
router.delete(
    "/apertura/:aperturaVacanteId/candidato/:candidatoId",
    eliminarPostulacionController
);

export default router;