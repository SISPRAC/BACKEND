import { Router } from "express";
import {getPracticantesController} from "../controllers/practicanteController.js"

const router = Router();

router.get("/all", getPracticantesController);

export default router;