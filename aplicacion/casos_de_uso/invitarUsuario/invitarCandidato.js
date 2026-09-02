import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracInvitationTemplate.js";
import { tokenService } from "../../../infraestructura/tokenService.js";

export const invitarCandidato = async ({
    correo,
    codigo,
    nombre
}) => {

    if (!correo) {
        throw new BadRequestError(
            "El correo es obligatorio"
        );
    }

    if (!codigo) {
        throw new BadRequestError(
            "El código del candidato es obligatorio"
        );
    }

    const token =
        tokenService.generateInvitationCandidatoToken(
            correo,
            codigo
        );

    const linkRegistro =
    `${process.env.FRONTEND_URL}/registrarCandidato?token=${token}`;

    const html =
        sispracInvitationTemplate({
            codigo,
            nombre,
            linkInscripcion: linkRegistro
        });

    await sendEmail({
        to: correo,
        subject: "Invitación para registrarse en SISPRAC",
        html
    });

    return {
        message: "Invitación enviada correctamente"
    };
};
