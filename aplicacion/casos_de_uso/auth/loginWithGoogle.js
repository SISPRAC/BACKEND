import { OAuth2Client } from "google-auth-library";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { buildAuthSession } from "./buildAuthSession.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (
    userRepository,
    candidatoRepository,
    practicanteRepository,
    { idToken }
) => {
    if (!idToken) {
        throw new BadRequestError("Token de Google requerido");
    }

    // 1. Verificar el token con Google
    let googleData;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        googleData = ticket.getPayload();
    } catch {
        throw new BadRequestError("Token de Google inválido");
    }

    const { sub, email, email_verified } = googleData;

    if (!email_verified) {
        throw new BadRequestError("El correo de Google no está verificado");
    }

    // 2. Opción A: solo usuarios ya registrados
    const user = await userRepository.findBycorreo(email);

    if (!user) {
        throw new BadRequestError("Usuario no registrado. Regístrate primero");
    }

    if (user.estado !== "ACTIVO") {
        throw new BadRequestError("Usuario inactivo");
    }

    // 3. Vincular la cuenta de Google la primera vez
    if (!user.google_id) {
        await userRepository.updateGoogleId(user.id, sub);
        user.google_id = sub;
    } else if (user.google_id !== sub) {
        throw new BadRequestError("Este correo está vinculado a otra cuenta de Google");
    }

    // 4. Misma sesión que el login normal
    return buildAuthSession(user, candidatoRepository, practicanteRepository);
};