import { Router } from "express";
import { getIdiomasController } from "../controllers/idiomaController.js";

const router = Router();

router.get("/all", getIdiomasController);

export default router;