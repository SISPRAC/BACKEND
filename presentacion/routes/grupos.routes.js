import { Router } from "express";
import {CrearGrupoController, getGruposController, getCandidatosByGrupoController, getGrupoController, EditarGrupoController, deleteGrupoController} from "../controllers/grupoController.js"

const router = Router();

router.get("/all", getGruposController);
router.post("/crear",CrearGrupoController);
router.get("/:id/candidatos", getCandidatosByGrupoController);
router.put("/:id", EditarGrupoController);
router.get("/:id", getGrupoController);
router.delete("/:id", deleteGrupoController);


export default router;