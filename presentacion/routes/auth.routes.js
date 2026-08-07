import { Router } from "express";
import { loginController, refreshToken, logout } from "../controllers/authController.js";
const router = Router();

router.post("/login", loginController);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;