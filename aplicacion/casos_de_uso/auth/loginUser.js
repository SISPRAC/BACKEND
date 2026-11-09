import bcrypt from "bcryptjs";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { buildAuthSession } from "./buildAuthSession.js";

export const loginUser = async (
    userRepository,
    candidatoRepository,
    practicanteRepository,
    { correo, password }
) => {

    if (!correo || !password) {
        throw new BadRequestError("Datos incompletos");
    }

    const user = await userRepository.findBycorreo(correo);

    if (!user) {
        throw new BadRequestError("Usuario no encontrado");
    }

    if (user.estado !== "ACTIVO") {
        throw new BadRequestError("Usuario inactivo");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new BadRequestError("Credenciales inválidas");
    }

    return buildAuthSession(user, candidatoRepository, practicanteRepository);
};