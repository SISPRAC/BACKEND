
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import {
    sispracConvenioRechazadoTemplate
} from "../../../infraestructura/external/email/templates/sispracConvenioRechazadoTemplate.js";

export const notificarConvenioRechazado = async ({
    correo,
    nombreRepresentante,
    nombreEmpresa,
    motivo
}) => {

    const html = sispracConvenioRechazadoTemplate({
        nombreRepresentante,
        nombreEmpresa,
        motivo
    });

    await sendEmail({
        to: correo,
        subject: `Convenio rechazado - ${nombreEmpresa}`,
        html
    });

    return {
        message: "Correo de rechazo del convenio enviado correctamente."
    };
};
