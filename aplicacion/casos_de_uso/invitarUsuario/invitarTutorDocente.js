import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { tokenService } from "../../../infraestructura/tokenService.js";
import { sispracTutorDocenteInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracTutorDocenteInvitationTemplate.js";

export const invitarTutorDocente = async ({ correo }) => {

    if (!correo) {
        throw new BadRequestError("El correo es obligatorio");
    }

    const token = tokenService.generateInvitationTutorDocenteToken(correo); // ajusta al nombre real

    const linkRegistro =
        `${process.env.FRONTEND_URL}/registrarStaff?token=${token}`;

    const html = sispracTutorDocenteInvitationTemplate({ linkRegistro });

    await sendEmail({
        to: correo,
        subject: "Invitación como Tutor Docente en SISPRAC",
        html
    });

    return {
        message: "Invitación enviada correctamente"
    };
};