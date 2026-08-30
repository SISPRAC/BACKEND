import { Router } from "express";
import { getTutorEmpresarialController } from "../controllers/tutorEmpresarialController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/all", verifyToken, getTutorEmpresarialController);

export default router;
