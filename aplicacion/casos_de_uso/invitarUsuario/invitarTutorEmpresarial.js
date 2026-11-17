import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { tokenService } from "../../../infraestructura/tokenService.js";
import { sispracTutorEmpresarialInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracTutorInvitationTemplate.js";
import { empresaRepository } from "../../../infraestructura/repositorios/empresaRepositoryImpl.js"; 

export const invitarTutorEmpresarial = async ({
    correo,
    empresa_id
}) => {

    if (!correo) {
        throw new BadRequestError("El correo es obligatorio");
    }

    if (!empresa_id) {
        throw new BadRequestError("La empresa es obligatoria");
    }

    const empresa = await empresaRepository.findById(empresa_id);

    if (!empresa) {
        throw new BadRequestError("La empresa no existe");
    }

    const token =
        tokenService.generateInvitationTutorEmpresarialToken(
            correo,
            empresa_id
        );

    const linkRegistro =
        `${process.env.FRONTEND_URL}/registrarStaff?token=${token}`;

    const html = sispracTutorEmpresarialInvitationTemplate({
        linkRegistro,
        nombreEmpresa: empresa.nombre
    });

    await sendEmail({
        to: correo,
        subject: `${empresa.nombre} te invita a ser tutor empresarial en SISPRAC`,
        html
    });

    return {
        message: "Invitación enviada correctamente"
    };
};