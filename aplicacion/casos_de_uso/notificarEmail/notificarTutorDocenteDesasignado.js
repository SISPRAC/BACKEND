
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import {
    sispracTutorDocenteDesasignadoTemplate
} from "../../../infraestructura/external/email/templates/sispracTutorDocenteDesasignadoTemplate.js";

export const notificarTutorDocenteDesasignado = async ({
    correo,
    nombreTutor,
    nombreGrupo,
    nombrePeriodo,
    motivo = "CAMBIO_TUTOR"
}) => {

    const html = sispracTutorDocenteDesasignadoTemplate({
        nombreTutor,
        nombreGrupo,
        nombrePeriodo,
        motivo
    });

    const esEliminacion = motivo === "ELIMINACION_GRUPO";

    await sendEmail({
        to: correo,
        subject: esEliminacion
            ? `Eliminación de grupo - ${nombreGrupo}`
            : `Desasignación como Tutor Docente - ${nombreGrupo}`,
        html
    });

    return {
        message: "Correo de notificación enviado correctamente."
    };
};
