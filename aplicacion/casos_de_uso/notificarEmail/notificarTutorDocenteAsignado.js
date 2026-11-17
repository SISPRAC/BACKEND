
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import {
    sispracTutorDocenteAsignadoTemplate
} from "../../../infraestructura/external/email/templates/sispracTutorDocenteAsignadoTemplate.js";

export const notificarTutorDocenteAsignado = async ({
    correo,
    nombreTutor,
    nombreGrupo,
    nombrePeriodo,
    cantidadPracticantes
}) => {

    const html = sispracTutorDocenteAsignadoTemplate({
        nombreTutor,
        nombreGrupo,
        nombrePeriodo,
        cantidadPracticantes
    });

    await sendEmail({
        to: correo,
        subject: `Asignación como Tutor Docente - ${nombreGrupo}`,
        html
    });

    return {
        message: "Correo de asignación enviado correctamente."
    };
};
