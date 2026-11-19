
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRechazoTemplate } from "../../../infraestructura/external/email/templates/sispracRechazoTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarRechazoPostulacion = async ({
    postulacion,
    userRepository,
    notificacionRepository
}) => {

    const candidato = postulacion.Candidato;
    const usuarioCandidato = candidato?.Usuario;

    const apertura = postulacion.AperturaVacante;
    const vacante = apertura?.Vacante;
    const empresa = vacante?.Convenio?.Empresa;

    const motivo = postulacion.comentarioEmpresa;

    // Buscar únicamente a los directores.
    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const datosComunes = {
        nombrePracticante: obtenerNombre(usuarioCandidato),
        codigo: candidato?.codigo ?? "No disponible",
        nombreEmpresa: empresa?.nombre ?? "No disponible",
        nombreVacante: vacante?.nombre ?? "No disponible",
        motivo
    };

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const notificaciones = directores
        .filter((director) => director?.id)
        .map((director) => {

            return crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: director.id,
                    titulo: "Postulación rechazada",
                    descripcion: `La empresa ${datosComunes.nombreEmpresa} ha rechazado la postulación de ${datosComunes.nombrePracticante} para la vacante "${datosComunes.nombreVacante}". Motivo: ${motivo || "No especificado"}.`
                }
            );
        });

    const resultadosNotificaciones = await Promise.allSettled(
        notificaciones
    );

    resultadosNotificaciones.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de rechazo:",
                resultado.reason
            );
        }

    });

    // ==========================================
    // NOTIFICACIONES POR CORREO
    // ==========================================

    const envios = directores
        .filter((director) => director?.correo)
        .map((director) => {

            const html = sispracRechazoTemplate({
                ...datosComunes,
                nombreDirector: obtenerNombre(director)
            });

            return sendEmail({
                to: director.correo,
                subject: "Notificación de postulación rechazada",
                html
            });
        });

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error enviando notificación de rechazo:",
                resultado.reason
            );
        }

    });

};
