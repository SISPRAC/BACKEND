import { Router } from "express";
import { getHabilidadesBlandasController } from "../controllers/habilidadBlandaController.js";

const router = Router();

router.get("/all", getHabilidadesBlandasController);

export default router;