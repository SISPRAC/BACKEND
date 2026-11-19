// infraestructura/external/email/templates/sispracConvenioVencidoTemplate.js

const escapeHtml = (valor = "") =>
    String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [anio, mes, dia] = String(fecha).split("-");
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : String(fecha);
};

export const sispracConvenioVencidoTemplate = ({
    nombreDestinatario,
    rol,
    nombreEmpresa,
    fechaInicio,
    fechaFin
}) => {

    const esEmpresa = rol === "EMPRESA";
    const titulo = "Convenio vencido";

    const mensaje = esEmpresa
        ? `Tu convenio con la universidad ha <strong>vencido</strong> por cumplirse su fecha de finalización. Para seguir participando en el proceso de prácticas, es necesario cargar un nuevo convenio en SISPRAC.`
        : `El convenio de la empresa <strong>${escapeHtml(nombreEmpresa)}</strong> ha pasado a estado <strong>VENCIDO</strong> de forma automática por cumplirse su fecha de finalización.`;

    const cierre = esEmpresa
        ? "Ingresa a SISPRAC y carga el nuevo convenio para su revisión."
        : "Ingresa a SISPRAC para hacer seguimiento y, si es necesario, contactar a la empresa.";

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titulo}</title>
    </head>

    <body style="margin:0; padding:0; background:#f4f4f5; font-family:Arial,sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden;">

            <div style="background:#dc2626; padding:25px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:23px;">SISPRAC</h1>
                <p style="color:#ffffff; margin:8px 0 0;">Gestión de prácticas profesionales</p>
            </div>

            <div style="padding:30px; color:#334155;">
                <h2 style="color:#1e293b; margin-top:0;">${titulo}</h2>

                <p>
                    Hola, <strong>${escapeHtml(nombreDestinatario || (esEmpresa ? "Empresa" : "Director de Programa"))}</strong>.
                </p>

                <p style="line-height:1.6;">${mensaje}</p>

                <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:15px; margin:22px 0; border-radius:5px;">
                    <p style="margin:0 0 10px; color:#991b1b; font-weight:bold;">Información del convenio</p>
                    <p style="margin:5px 0;"><strong>Empresa:</strong> ${escapeHtml(nombreEmpresa)}</p>
                    <p style="margin:5px 0;"><strong>Fecha de inicio:</strong> ${escapeHtml(formatearFecha(fechaInicio))}</p>
                    <p style="margin:5px 0;"><strong>Fecha de finalización:</strong> ${escapeHtml(formatearFecha(fechaFin))}</p>
                    <p style="margin:5px 0;"><strong>Estado:</strong> VENCIDO</p>
                </div>

                <p style="line-height:1.6;">${cierre}</p>

                <p style="margin-top:30px;">
                    Atentamente,<br>
                    <strong>Equipo SISPRAC</strong>
                </p>
            </div>

            <div style="background:#f8fafc; padding:15px; text-align:center; color:#94a3b8; font-size:12px;">
                Este es un mensaje automático generado por SISPRAC.
            </div>
        </div>
    </body>
    </html>
    `;
};