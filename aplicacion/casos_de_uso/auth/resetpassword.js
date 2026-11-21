import bcrypt from "bcryptjs";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { passwordChangedTemplate } from "../../../infraestructura/external/email/templates/passwordchangedtemplate.js";
import { hashToken } from "./forgotpassword.js";

const validarPassword = (password) => {
    if (password.length < 8) {
        throw new BadRequestError("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        throw new BadRequestError("La contraseña debe incluir letras y números");
    }
};

export const resetPassword = async (
    userRepository,
    resetTokenRepository,
    sendEmail,
    { token, nuevaPassword }
) => {

    if (!token || !nuevaPassword) {
        throw new BadRequestError("Datos incompletos");
    }

    validarPassword(nuevaPassword);

    // El usuario NO viene del cliente: sale del token guardado en BD
    const registro = await resetTokenRepository.findByTokenHash(hashToken(token));

    const fechaExpiracion = new Date(registro?.expira_en);

    console.log("========== DEBUG RESET PASSWORD ==========");
    console.log("Token recibido:", !!token);
    console.log("Hash generado:", hashToken(token));
    console.log("Registro encontrado:", registro?.toJSON());
    console.log("Usado:", registro?.usado);
    console.log("Expiración BD:", registro?.expira_en);
    console.log("Fecha actual:", new Date());
    console.log(
        "Diferencia en minutos:",
        registro
            ? (new Date(registro.expira_en).getTime() - Date.now()) / 60000
            : "No existe registro"
    );
    console.log("==========================================");

    if (
        !registro ||
        registro.usado ||
        !registro.expira_en ||
        Number.isNaN(fechaExpiracion.getTime()) ||
        fechaExpiracion.getTime() <= Date.now()
    ) {
        throw new BadRequestError("El enlace es inválido o ha expirado");
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    await userRepository.updatePassword(registro.user_id, passwordHash);

    // Uso único: se borran todos los tokens de ese usuario
    await resetTokenRepository.deleteByUserId(registro.user_id);

    // Correo de confirmación. La contraseña ya cambió, así que si el envío
    // falla NO se debe devolver error al usuario: solo se registra en consola.
    try {
        const user = await userRepository.findById(registro.user_id);

        if (user) {
            const fecha = new Date().toLocaleString("es-CO", {
                timeZone: "America/Bogota",
                dateStyle: "long",
                timeStyle: "short"
            });

            // Sin await: no hace esperar al usuario por el correo
            sendEmail({
                to: user.correo,
                subject: "Tu contraseña fue actualizada - SISPRAC",
                html: passwordChangedTemplate({
                    nombre: user.nombres,
                    fecha,
                    loginLink: `${process.env.FRONTEND_URL}/`
                })
            }).catch((err) =>
                console.error("Error enviando correo de confirmación:", err)
            );
        }
    } catch (err) {
        console.error("Error preparando correo de confirmación:", err);
    }

    return { message: "Contraseña actualizada correctamente" };
};