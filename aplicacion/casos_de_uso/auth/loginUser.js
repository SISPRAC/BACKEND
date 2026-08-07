import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const loginUser = async (userRepository, { correo, password }) => {

    const user = await userRepository.findBycorreo(correo);

    if (!user) {
        throw new BadRequestError("USER_NOT_FOUND");
    }

    if (!correo || !password) {
        throw new BadRequestError("Datos incompletos");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new BadRequestError("INVALID_CREDENTIALS");
    }

    const roles = user.Roles.map(r => r.nombre);

    const accessToken = jwt.sign(
        { 
            id: user.id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            correo: user.correo,
            roles 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
    
    const refreshToken = jwt.sign(
        { 
            id: user.id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            correo: user.correo,
            roles
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    return { user, accessToken, refreshToken };
};