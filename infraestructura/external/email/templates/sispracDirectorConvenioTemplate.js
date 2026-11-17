
const escapeHtml = (valor = "") => {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const sispracDirectorConvenioTemplate = ({
    nombreDirector,
    nombreEmpresa,
    accion,
    fechaInicio,
    fechaFin
}) => {

    const esNuevo = accion === "CARGADO";

    const titulo = esNuevo
        ? "Nuevo convenio pendiente de revisión"
        : "Convenio actualizado y reenviado";

    const mensaje = esNuevo
        ? `La empresa <strong>${escapeHtml(nombreEmpresa)}</strong> ha cargado un nuevo convenio en SISPRAC. El documento se encuentra pendiente de revisión y aprobación.`
        : `La empresa <strong>${escapeHtml(nombreEmpresa)}</strong> ha actualizado su convenio y lo ha reenviado para revisión.`;

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
                <h1 style="color:#ffffff; margin:0; font-size:23px;">
                    SISPRAC
                </h1>
                <p style="color:#ffffff; margin:8px 0 0;">
                    Gestión de prácticas profesionales
                </p>
            </div>

            <div style="padding:30px; color:#334155;">

                <h2 style="color:#1e293b; margin-top:0;">
                    ${titulo}
                </h2>

                <p>
                    Hola, <strong>${escapeHtml(nombreDirector || "Director de Programa")}</strong>.
                </p>

                <p style="line-height:1.6;">
                    ${mensaje}
                </p>

                <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:15px; margin:22px 0; border-radius:5px;">

                    <p style="margin:0 0 10px; color:#991b1b; font-weight:bold;">
                        Información del convenio
                    </p>

                    <p style="margin:5px 0;">
                        <strong>Empresa:</strong>
                        ${escapeHtml(nombreEmpresa)}
                    </p>

                    <p style="margin:5px 0;">
                        <strong>Fecha de inicio:</strong>
                        ${escapeHtml(fechaInicio)}
                    </p>

                    <p style="margin:5px 0;">
                        <strong>Fecha de finalización:</strong>
                        ${escapeHtml(fechaFin)}
                    </p>

                    <p style="margin:5px 0;">
                        <strong>Estado:</strong>
                        PENDIENTE
                    </p>

                </div>

                <p style="line-height:1.6;">
                    Ingresa a SISPRAC para consultar el documento y realizar
                    el proceso de revisión correspondiente.
                </p>

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
