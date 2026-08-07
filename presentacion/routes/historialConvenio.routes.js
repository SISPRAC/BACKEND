import { Router } from "express";
import {RegistrarHistorialConvenioController} from "../controllers/historialConvenioController.js"

const router = Router();

router.post("/registrar", RegistrarHistorialConvenioController)


export default router;