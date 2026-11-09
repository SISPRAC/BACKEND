import { loginUser } from "../../aplicacion/casos_de_uso/auth/loginUser.js";
import { refreshTokenUseCase } from "../../aplicacion/casos_de_uso/auth/refreshToken.js";
import { forgotPassword } from "../../aplicacion/casos_de_uso/auth/forgotpassword.js";
import { resetPassword } from "../../aplicacion/casos_de_uso/auth/resetpassword.js";

import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { candidatoRepository } from "../../infraestructura/repositorios/candidatoRepositoryImpl.js";
import { PracticanteRepository } from "../../infraestructura/repositorios/practicanteRepositoryImpl.js";
import { passwordResetTokenRepository as resetTokenRepository } from "../../infraestructura/repositorios/passwordresettokenRepositoryImpl.js";
import { loginWithGoogle } from "../../aplicacion/casos_de_uso/auth/loginWithGoogle.js";

// Ajusta esta ruta a donde tengas tu servicio de correo
import { sendEmail } from "../../infraestructura/external/email/mailService.js";

export const loginController = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await loginUser(
            userRepository,
            candidatoRepository,
            PracticanteRepository,
            req.body
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 8 * 60 * 60 * 1000
        });

        res.status(200).json({ user, accessToken });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        const result = await refreshTokenUseCase(
            userRepository,
            candidatoRepository,
            PracticanteRepository,
            token
        );

        res.status(200).json(result);

    } catch (error) {
        if (error.statusCode) {
            if (error.statusCode === 401) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict"
                });
            }

            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        res.status(200).json({
            message: "Sesión cerrada correctamente"
        });

    } catch (error) {
        console.log("Error al cerrar sesión", error);

        return res.status(500).json({
            message: "Error al cerrar sesión"
        });
    }
};

// ---------- RECUPERAR CONTRASEÑA ----------

export const forgotPasswordController = async (req, res) => {
    try {
        const result = await forgotPassword(
            userRepository,
            resetTokenRepository,
            sendEmail,
            { correo: req.body.correo }
        );

        res.status(200).json(result);

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const result = await resetPassword(
            userRepository,
            resetTokenRepository,
            sendEmail,
            {
                token: req.body.token,
                nuevaPassword: req.body.nuevaPassword
            }
        );

        // Por seguridad, cierra cualquier sesión abierta en este navegador
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        res.status(200).json(result);

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const googleLoginController = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await loginWithGoogle(
            userRepository,
            candidatoRepository,
            PracticanteRepository,
            { idToken: req.body.idToken }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 8 * 60 * 60 * 1000
        });

        res.status(200).json({ user, accessToken });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};