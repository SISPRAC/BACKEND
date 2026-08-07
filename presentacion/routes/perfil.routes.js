import { Router } from "express";
import {CrearPerfilController } from "../controllers/perfilController.js";
import { getPerfilesController } from "../controllers/perfilController.js";

const router = Router();


router.post("/crear",CrearPerfilController);
router.get("/all", getPerfilesController);



export default router;