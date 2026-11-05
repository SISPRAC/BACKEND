import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const loginUser = async (
    userRepository,
    candidatoRepository,
    PracticanteRepository,
    { correo, password }
) => {

    const user = await userRepository.findBycorreo(correo);

    if (!user) {
        throw new BadRequestError("Usuario no encontrado");
    }

    if (!correo || !password) {
        throw new BadRequestError("Datos incompletos");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new BadRequestError("Credenciales inválidas");
    }

    const roles = user.Roles.map(r => r.nombre);

    // Obtener el ID del practicante, si el usuario tiene uno
    let practicante_id = null;

    const candidato = await candidatoRepository.findByUserId(user.id);

    if (candidato) {
        const practicante = await PracticanteRepository.findByCandidatoId(candidato.id);

        if (practicante) {
            practicante_id = practicante.id;
        }
    }

    const payload = {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        roles,
        practicante_id
    };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    const { password: _, ...userSinPassword } = user.toJSON();

    return { user: userSinPassword, accessToken, refreshToken };
};