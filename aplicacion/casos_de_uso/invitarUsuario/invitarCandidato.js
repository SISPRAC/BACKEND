import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracInvitationTemplate.js";
import { tokenService } from "../../../infraestructura/tokenService.js";
// import { grupoRepository } from "../../../infraestructura/repositories/grupoRepository.js"; // ajusta la ruta si validas el grupo

export const invitarCandidato = async (
    grupoRepository,
    {
        correo,
        codigo,
        nombre,
        grupo_id
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

    // El grupo es opcional: si viene, debe existir
    if (grupo_id) {
        const grupo = await grupoRepository.findById(grupo_id);
        if (!grupo) {
            throw new BadRequestError("El grupo no existe");
        }
    }


    const token =
        tokenService.generateInvitationCandidatoToken(
            correo,
            codigo,
            grupo_id
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