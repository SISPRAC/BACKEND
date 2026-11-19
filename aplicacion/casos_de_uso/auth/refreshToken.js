import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";
import { buildPayload } from "./buildAuthSession.js";

export const refreshTokenUseCase = async (
    userRepository,
    candidatoRepository,
    practicanteRepository,
    token
) => {

    if (!token) {
        throw new UnauthorizedError("NO_TOKEN");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new UnauthorizedError("TOKEN_EXPIRADO");
        }
        throw new UnauthorizedError("TOKEN_INVALIDO");
    }

    const user = await userRepository.findById(decoded.id);

    if (!user || user.estado !== "ACTIVO") {
        throw new UnauthorizedError("USUARIO_NO_VALIDO");
    }

    const payload = await buildPayload(user, candidatoRepository, practicanteRepository);

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "8h" }
    );

    const { password: _, ...userSinPassword } = user.toJSON();

    return { accessToken, user: userSinPassword };
};

export default refreshTokenUseCase;