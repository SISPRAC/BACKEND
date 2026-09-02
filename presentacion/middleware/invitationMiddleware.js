import { tokenService } from "../../infraestructura/tokenService.js";
import { BadRequestError } from "../../shared/errors/BadRequestError.js";

export const verifyInvitationToken = (req, res, next) => {

    try {

        const token = req.query.token;

        if (!token) {
            throw new BadRequestError(
                "Token de invitación requerido"
            );
        }

        const invitacion =
            tokenService.verifyInvitationToken(token);

        if (!invitacion?.correo || !invitacion?.rol) {
            throw new BadRequestError(
                "El token de invitación no es válido"
            );
        }

        req.invitacion = invitacion;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "La invitación ha expirado"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "El token de invitación no es válido"
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(401).json({
            message: "No se pudo validar la invitación"
        });
    }
};

export const validarInvitacionController = (req, res) => {

    return res.status(200).json({
        valid: true,
        invitacion: req.invitacion
    });

};