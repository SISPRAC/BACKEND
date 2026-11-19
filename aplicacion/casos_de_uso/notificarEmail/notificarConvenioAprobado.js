
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import {
    sispracConvenioAprobadoTemplate
} from "../../../infraestructura/external/email/templates/sispracConvenioAprobadoTemplate.js";

export const notificarConvenioAprobado = async ({
    correo,
    nombreRepresentante,
    nombreEmpresa
}) => {

    const html = sispracConvenioAprobadoTemplate({
        nombreRepresentante,
        nombreEmpresa
    });

    await sendEmail({
        to: correo,
        subject: `Convenio aprobado - ${nombreEmpresa}`,
        html
    });

    return {
        message: "Correo de aprobación del convenio enviado correctamente."
    };
};
