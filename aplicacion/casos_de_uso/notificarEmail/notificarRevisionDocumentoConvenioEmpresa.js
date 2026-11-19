import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRevisionDocumentoEmpresaTemplate } from "../../../infraestructura/external/email/templates/sispracRevisionDocumentoEmpresaTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

export const notificarRevisionDocumentoConvenioEmpresa = async ({
    empresa,
    nombreDocumento,
    estado,
    observacion,
    notificacionRepository
}) => {

    const usuarioEmpresa = empresa?.Usuario;

    const aprobado = estado === "APROBADO";

    const datos = {
        nombreEmpresa: empresa?.nombre ?? "Empresa",
        nombreDocumento: nombreDocumento ?? "Documento de convenio",
        estado,
        observacion
    };

    // ==========================================
    // NOTIFICACIÓN INTERNA
    // ==========================================

    if (usuarioEmpresa?.id) {

        try {

            await crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuarioEmpresa.id,
                    titulo: aprobado
                        ? "Documento aprobado"
                        : "Documento rechazado",
                    descripcion: aprobado
                        ? `Tu documento "${datos.nombreDocumento}" ha sido aprobado.`
                        : `Tu documento "${datos.nombreDocumento}" ha sido rechazado. Motivo: ${observacion || "No especificado"}.`
                }
            );

        } catch (error) {

            console.error(
                "Error creando notificación interna de revisión de documento:",
                error
            );

        }

    }

    // ==========================================
    // NOTIFICACIÓN POR CORREO
    // ==========================================

    if (usuarioEmpresa?.correo) {

        try {

            const html = sispracRevisionDocumentoEmpresaTemplate(datos);

            await sendEmail({
                to: usuarioEmpresa.correo,
                subject: aprobado
                    ? "Documento aprobado"
                    : "Documento rechazado",
                html
            });

        } catch (error) {

            console.error(
                "Error enviando correo de revisión de documento:",
                error
            );

        }

    }

};