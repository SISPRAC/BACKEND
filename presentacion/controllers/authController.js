import e from "express";
import { loginUser } from "../../aplicacion/casos_de_uso/auth/loginUser.js";
import { refreshTokenUseCase } from "../../aplicacion/casos_de_uso/auth/refreshToken.js";
import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";

export const loginController = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await loginUser(
            userRepository,
            req.body
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
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

        const result = await refreshTokenUseCase(userRepository, token);

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

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken",
         { httpOnly: true, 
            secure: "production", 
            sameSite: 'Strict' 
        });
    res.status(200).json({message: "Sesión cerrada correctamente"});
  } catch (error) {
    console.log("Error al cerrar sesión", error);
    return res.status(500).json({  message: "Error al cerrar sesión" });
  }  
}