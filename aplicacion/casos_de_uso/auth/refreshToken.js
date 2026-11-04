import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const refreshTokenUseCase = async (
    userRepository,
    candidatoRepository,
    PracticanteRepository,
    token
) => {

    if (!token) {
        throw new BadRequestError("NO_TOKEN");
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
        throw new BadRequestError("Usuario no encontrado");
    }

    let practicante_id = null;

    const candidato = await candidatoRepository.findByUserId(user.id);

    if (candidato) {
        const practicante = await PracticanteRepository.findByCandidatoId(candidato.id);

        if (practicante) {
            practicante_id = practicante.id;
        }
    }

    const newAccessToken = jwt.sign(
        {
            id: user.id,
            roles: user.roles,
            practicante_id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );

    return {
        accessToken: newAccessToken,
        user
    };
};

export default refreshTokenUseCase;