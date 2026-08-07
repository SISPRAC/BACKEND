import { Router } from "express";
import { registrarCandidatoController, getCandidatosController, getCandidatosDisponiblesController, updateCandidatoController, getCandidatoPerfilController } from "../controllers/candidatoController.js";
import { upload  } from "../middleware/uploadMulter.js";

const router = Router();

router.post("/registrarCandidato",upload.single("cv"), registrarCandidatoController);
router.put("/:id", updateCandidatoController);
router.get("/all", getCandidatosController);
router.get("/disponibles", getCandidatosDisponiblesController);
router.get(
    "/perfil/:nombrePerfil",
    getCandidatoPerfilController
);

export default router;
