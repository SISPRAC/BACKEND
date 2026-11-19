
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracPostulacionesTemplate } from "../../../infraestructura/external/email/templates/sispracPostulacionesTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarPostulacionesEmpresa = async ({
    aperturaVacante,
    candidatos,
    notificacionRepository
}) => {

    const vacante = aperturaVacante.Vacante;
    const empresa = vacante.Convenio.Empresa;
    const usuarioEmpresa = empresa.Usuario;

    if (!usuarioEmpresa) {
        console.error(
            "No se encontró el usuario asociado a la empresa."
        );
        return;
    }

    const cantidad = candidatos.length;

    const nombresCandidatos = candidatos.map(
        candidato => obtenerNombre(candidato.Usuario)
    );

    // ==========================================
    // NOTIFICACIÓN INTERNA
    // ==========================================

    if (usuarioEmpresa.id) {

        try {

            await crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuarioEmpresa.id,

                    titulo: "Nuevos candidatos postulados",

                    descripcion: `Se han registrado ${cantidad} ${cantidad === 1 ? "candidato" : "candidatos"} para la vacante "${vacante.nombre}": ${nombresCandidatos.join(", ")}.`
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

        const datosCandidatos = candidatos.map(candidato => ({
            nombre: obtenerNombre(candidato.Usuario),
            codigo: candidato.codigo
        }));

        try {

            const html = sispracPostulacionesTemplate({
                nombreEmpresa: empresa.nombre,
                nombreVacante: vacante.nombre,
                candidatos: datosCandidatos,
                cantidad
            });

            await sendEmail({
                to: usuarioEmpresa.correo,
                subject: "Nuevos candidatos postulados a tu vacante",
                html
            });

        } catch (error) {

            console.error(
                "Error enviando correo de nuevas postulaciones:",
                error
            );

        }
    }

};
