import { Router } from "express";
import { getIdiomasController } from "../controllers/idiomaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/all", getIdiomasController);

export default router;