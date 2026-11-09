import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    loginController,
    refreshToken,
    logout,
    forgotPasswordController,
    resetPasswordController,
    googleLoginController
} from "../controllers/authController.js";

const router = Router();

// Máximo 5 solicitudes de recuperación por hora por IP (evita spam de correos)
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiados intentos, intenta de nuevo más tarde" }
});

// Máximo 10 intentos de cambio cada 15 minutos por IP (evita adivinar tokens)
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiados intentos, intenta de nuevo más tarde" }
});

const googleLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiados intentos, intenta de nuevo más tarde" }
});


router.post("/login", loginController);
router.get("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/google", googleLoginLimiter, googleLoginController);

router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordController);
router.post("/reset-password", resetPasswordLimiter, resetPasswordController);

export default router;