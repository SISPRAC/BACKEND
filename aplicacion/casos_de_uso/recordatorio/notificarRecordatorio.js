// aplicacion/casos_de_uso/recordatorio/notificarRecordatorio.js
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracRecordatorioTemplate } from "../../../infraestructura/external/email/templates/sispracRecordatorioTemplate.js";
import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (u) => `${u?.nombres ?? ""} ${u?.apellidos ?? ""}`.trim();

export const notificarRecordatorio = async ({
    usuario, titulo, mensaje, items = [], cierre, notificacionRepository
}) => {
    if (usuario?.id) {
        try {
            await crearNotificacion({ notificacionRepository }, {
                usuario_id: usuario.id,
                titulo,
                descripcion: items.length ? `${mensaje} Pendiente: ${items.join("; ")}.` : mensaje
            });
        } catch (error) {
            console.error("Error notificación interna de recordatorio:", error);
        }
    }

    if (usuario?.correo) {
        await sendEmail({
            to: usuario.correo,
            subject: `${titulo} - SISPRAC`,
            html: sispracRecordatorioTemplate({
                nombreDestinatario: obtenerNombre(usuario), titulo, mensaje, items, cierre
            })
        });
    }
};