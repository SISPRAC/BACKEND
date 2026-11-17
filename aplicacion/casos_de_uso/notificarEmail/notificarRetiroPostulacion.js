
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRetiroPostulacionTemplate } from "../../../infraestructura/external/email/templates/sispracRetiroPostulacionTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

export const notificarRetiroPostulacionEmpresa = async ({
    postulacion,
    notificacionRepository
}) => {

    const candidato = postulacion.Candidato;
    const usuarioCandidato = candidato?.Usuario;

    const apertura = postulacion.AperturaVacante;
    const vacante = apertura?.Vacante;
    const empresa = vacante?.Convenio?.Empresa;
    const usuarioEmpresa = empresa?.Usuario;

    if (!usuarioEmpresa) {
        console.error(
            "No se encontró el usuario asociado a la empresa."
        );
        return;
    }

    const nombrePracticante =
        `${usuarioCandidato?.nombres ?? ""} ${usuarioCandidato?.apellidos ?? ""}`.trim();

    const datosComunes = {
        nombreEmpresa: empresa.nombre,
        nombrePracticante,
        codigo: candidato?.codigo ?? "No disponible",
        nombreVacante: vacante?.nombre ?? "No disponible"
    };

    // ==========================================
    // NOTIFICACIÓN EN LA PLATAFORMA
    // ==========================================

    if (usuarioEmpresa.id) {
        try {

            await crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuarioEmpresa.id,
                    titulo: "Actualización de candidato asignado",
                    descripcion: `La dirección del programa ha retirado a ${nombrePracticante} (código ${datosComunes.codigo}) de la vacante "${datosComunes.nombreVacante}". El practicante ya no continuará en el proceso de selección para esta vacante.`
                }
            );

        } catch (error) {

            console.error(
                "Error creando notificación interna para la empresa:",
                error
            );

        }
    }

    // ==========================================
    // NOTIFICACIÓN POR CORREO
    // ==========================================

    if (usuarioEmpresa.correo) {
        try {

            const html = sispracRetiroPostulacionTemplate(
                datosComunes
            );

            await sendEmail({
                to: usuarioEmpresa.correo,
                subject: "Actualización de candidato asignado a tu vacante",
                html
            });

        } catch (error) {

            console.error(
                "Error enviando correo de retiro a la empresa:",
                error
            );

        }
    }

};
