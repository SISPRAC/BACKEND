import { Router } from "express";
import {getConveniosController, getConvenioController, actualizarEstadoConvenioController} from "../controllers/convenioController.js"

const router = Router();

router.get("/all", getConveniosController);
router.get("/:id",getConvenioController);
router.put("/:id/estado", actualizarEstadoConvenioController);



export default router;