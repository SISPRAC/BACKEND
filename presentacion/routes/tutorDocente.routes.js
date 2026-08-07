import { Router } from "express";
import { getTutorDocentesController } from "../controllers/tutorDocenteController.js";

const router = Router();

router.get("/all", getTutorDocentesController);

export default router;
