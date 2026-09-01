import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracEmpresaInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracEmpresaInvitationTemplate.js";
import { tokenService } from "../../../infraestructura/tokenService.js";

export const invitarEmpresa = async ({
    correo,
    nombreEmpresa
}) => {

    if (!correo) {
        throw new BadRequestError(
            "El correo es obligatorio"
        );
    }

    if (!nombreEmpresa) {
        throw new BadRequestError(
            "El nombre de la empresa es obligatorio"
        );
    }

    const token =
        tokenService.generateInvitationEmpresaToken(
            correo
        );
        
    const linkRegistro =
        `${process.env.FRONTEND_URL}/registrarEmpresa?token=${token}`;

    const html =
        sispracEmpresaInvitationTemplate({
            nombreEmpresa,
            linkRegistro
        });

    await sendEmail({
        to: correo,
        subject:
            "Bienvenido a SISPRAC - Invitación para registrar su empresa",
        html
    });

    return {
        message: "Invitación enviada correctamente"
    };
};

