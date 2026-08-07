import { Router } from "express";
import { getVacantesController } from "../controllers/vacanteController.js";

const router = Router();


router.get("/all", getVacantesController);



export default router;