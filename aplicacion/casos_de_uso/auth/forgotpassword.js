import crypto from "crypto";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { passwordResetTemplate } from "../../../infraestructura/external/email/templates/passwordresettemplate.js";

export const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const MENSAJE_GENERICO = "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña";
const EXPIRA_MINUTOS = 15;

export const forgotPassword = async (
    userRepository,
    resetTokenRepository,
    sendEmail,
    { correo }
) => {

    if (!correo) {
        throw new BadRequestError("Datos incompletos");
    }

    const user = await userRepository.findBycorreo(correo.trim().toLowerCase());

    // Respuesta idéntica exista o no el usuario: evita enumerar correos
    if (!user) {
        return { message: MENSAJE_GENERICO };
    }

    // Un solo token activo por usuario
    await resetTokenRepository.deleteByUserId(user.id);

    // Token aleatorio: este va por correo; en BD solo se guarda su hash
    const token = crypto.randomBytes(32).toString("hex");

    await resetTokenRepository.create({
        user_id: user.id,
        token_hash: hashToken(token),
        expira_en: new Date(Date.now() + EXPIRA_MINUTOS * 60 * 1000)
    });

    const link = `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;

    // Sin await: así el tiempo de respuesta no delata si el correo existe
    sendEmail({
        to: user.correo,
        subject: "Recuperación de contraseña - SISPRAC",
        html: passwordResetTemplate({
            nombre: user.nombres,
            link,
            minutos: EXPIRA_MINUTOS
        })
    }).catch((err) => console.error("Error enviando correo de recuperación:", err));

    return { message: MENSAJE_GENERICO };
};