
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import {
    sispracTutorEmpresarialDesasignadoTemplate
} from "../../../infraestructura/external/email/templates/notificarTutorDesasignadoTemplate.js";

export const notificarTutorDesasignado = async ({
    correo,
    nombreTutor,
    nombreEmpresa,
    nombreVacante,
    nombrePeriodo
}) => {

    const html = sispracTutorEmpresarialDesasignadoTemplate({
        nombreTutor,
        nombreEmpresa,
        nombreVacante,
        nombrePeriodo
    });

    await sendEmail({
        to: correo,
        subject: "Notificación: eliminación de apertura de vacante - SISPRAC",
        html
    });
};
