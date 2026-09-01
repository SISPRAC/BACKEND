import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { tokenService } from "../../../infraestructura/tokenService.js";
import { sispracTutorInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracTutorInvitationTemplate.js";

export const invitarTutorDocente = async ({
    correo
}) => {

    if (!correo) {
        throw new BadRequestError(
            "El correo es obligatorio"
        );
    }

    const token =
        tokenService.generateInvitationTutorDocenteToken(
            correo
        );

    const linkRegistro =
        `${process.env.FRONTEND_URL}/registrarStaff?token=${token}`;

    const html =
        sispracTutorInvitationTemplate({
            linkRegistro
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

