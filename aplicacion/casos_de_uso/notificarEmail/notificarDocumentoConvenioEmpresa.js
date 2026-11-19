import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracDocumentoEmpresaTemplate } from "../../../infraestructura/external/email/templates/sispracDocumentoEmpresaTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarDocumentoConvenioEmpresa = async ({
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
        nombreDocumento: nombreDocumento ?? "No disponible",
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
                    titulo: "Documento de convenio pendiente de revisión",
                    descripcion: `La empresa ${datosComunes.nombreEmpresa} ha cargado el documento "${datosComunes.nombreDocumento}" y está pendiente de revisión.`
                }
            );
        });

    const resultadosNotificaciones = await Promise.allSettled(
        notificaciones
    );

    resultadosNotificaciones.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de documento de empresa:",
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

            const html = sispracDocumentoEmpresaTemplate({
                ...datosComunes,
                nombreDirector: obtenerNombre(director)
            });

            return sendEmail({
                to: director.correo,
                subject: "Documento de convenio pendiente de revisión",
                html
            });
        });

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error enviando correo de documento de empresa:",
                resultado.reason
            );
        }

    });

};