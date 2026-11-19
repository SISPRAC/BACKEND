
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracDirectorConvenioTemplate } from "../../../infraestructura/external/email/templates/sispracDirectorConvenioTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarDirectorConvenio = async ({
    empresa,
    convenio,
    accion,
    userRepository,
    notificacionRepository
}) => {

    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const esNuevo = accion === "CARGADO";

    const asunto = esNuevo
        ? "Nuevo convenio pendiente de revisión"
        : "Convenio actualizado y reenviado";

    const titulo = esNuevo
        ? "Nuevo convenio pendiente de revisión"
        : "Convenio actualizado";

    const descripcion = esNuevo
        ? `La empresa "${empresa.nombre}" ha cargado un nuevo convenio en SISPRAC. El documento se encuentra pendiente de revisión.`
        : `La empresa "${empresa.nombre}" ha actualizado su convenio y lo ha reenviado para revisión.`;

    const datosComunes = {
        nombreEmpresa: empresa.nombre,
        accion,
        fechaInicio: convenio.fecha_inicio,
        fechaFin: convenio.fecha_fin
    };

    // ==========================================
    // DESTINATARIOS
    // ==========================================

    const destinatarios = directores.map((director) => ({
        usuario: director,
        asunto,
        titulo,
        descripcion
    }));

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const notificaciones = destinatarios
        .filter(({ usuario }) => usuario?.id)
        .map(({ usuario, titulo, descripcion }) => {

            return crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                }
            );
        });

    const resultadosNotificaciones = await Promise.allSettled(
        notificaciones
    );

    resultadosNotificaciones.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de convenio al director:",
                resultado.reason
            );
        }

    });

    // ==========================================
    // NOTIFICACIONES POR CORREO
    // ==========================================

    const envios = destinatarios
        .filter(({ usuario }) => usuario?.correo)
        .map(({ usuario, asunto }) => {

            const html = sispracDirectorConvenioTemplate({
                ...datosComunes,
                nombreDirector: obtenerNombre(usuario)
            });

            return sendEmail({
                to: usuario.correo,
                subject: asunto,
                html
            });
        });

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error enviando notificación de convenio al director:",
                resultado.reason
            );
        }

    });

};
