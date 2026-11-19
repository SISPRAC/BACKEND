
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import {
    sispracTutorEmpresarialAsignadoTemplate
} from "../../../infraestructura/external/email/templates/sispracTutorEmpresarialAsignadoTemplate.js";

export const notificarTutorAsignado = async ({
    correo,
    nombreTutor,
    nombreEmpresa,
    nombreVacante,
    nombrePeriodo,
    cupos,
    fechaInicio,
    fechaFin
}) => {

    const html = sispracTutorEmpresarialAsignadoTemplate({
        nombreTutor,
        nombreEmpresa,
        nombreVacante,
        nombrePeriodo,
        cupos,
        fechaInicio,
        fechaFin
    });

    await sendEmail({
        to: correo,
        subject: `Has sido asignado como tutor empresarial - ${nombreVacante}`,
        html
    });

    return {
        message: "Correo de asignación enviado correctamente."
    };
};
