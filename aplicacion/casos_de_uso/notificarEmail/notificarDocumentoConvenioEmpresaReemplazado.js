import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracDocumentoEmpresaReemplazadoTemplate } from "../../../infraestructura/external/email/templates/sispracDocumentoEmpresaReemplazadoTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarDocumentoConvenioEmpresaReemplazado = async ({
    empresa,
    nombreDocumento,
    nombreArchivo,
    fechaSubida,
    userRepository,
    notificacionRepository
}) => {

    // Buscar únicamente a los directores.
    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const datosComunes = {
        nombreEmpresa: empresa?.nombre ?? "No disponible",
        nombreDocumento: nombreDocumento ?? "Documento de convenio",
        nombreArchivo: nombreArchivo ?? "No disponible",
        fechaSubida: new Date(fechaSubida ?? Date.now()).toLocaleString(
            "es-CO",
            { timeZone: "America/Bogota" }
        )
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
                    titulo: "Documento de convenio reemplazado",
                    descripcion: `La empresa ${datosComunes.nombreEmpresa} reemplazó el documento "${datosComunes.nombreDocumento}" y está pendiente de revisión.`
                }
            );
        });

    const resultadosNotificaciones = await Promise.allSettled(
        notificaciones
    );

    resultadosNotificaciones.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de documento reemplazado:",
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

            const html = sispracDocumentoEmpresaReemplazadoTemplate({
                ...datosComunes,
                nombreDirector: obtenerNombre(director)
            });

            return sendEmail({
                to: director.correo,
                subject: "Documento de convenio reemplazado",
                html
            });
        });

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error enviando correo de documento reemplazado:",
                resultado.reason
            );
        }

    });

};