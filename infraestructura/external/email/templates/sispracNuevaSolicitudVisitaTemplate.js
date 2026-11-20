const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

// ahora
// HH:mm[:ss] -> h:mm a. m. / p. m.
const formatearHora = (hora) => {
    if (!hora) return "";
    const [h, m] = String(hora).split(":");
    const horas = Number(h);
    return `${horas % 12 || 12}:${m} ${horas >= 12 ? "p. m." : "a. m."}`;
};

const formatearFecha = (fecha) => {
    return new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(fecha);
};

export const sispracNuevaSolicitudVisitaTemplate = ({
    nombreDestinatario,
    nombreTutorDocente,
    nombresPracticantes = [],
    fechas = []
}) => {

    const listaPracticantes = nombresPracticantes
        .map(
            (nombre) => `
            <li style="margin-bottom:4px;">${escapeHtml(nombre)}</li>`
        )
        .join("");

    const esPlural = nombresPracticantes.length > 1;

    const filasFechas = fechas
        .map((f) => {
            const rango =
                f.fecha_inicio === f.fecha_fin
                    ? formatearFecha(f.fecha_inicio)
                    : `${formatearFecha(f.fecha_inicio)} al ${formatearFecha(f.fecha_fin)}`;

            return `
            <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">
                    ${escapeHtml(rango)}
                </td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">
                    ${escapeHtml(formatearHora(f.hora_inicio))} - ${escapeHtml(formatearHora(f.hora_fin))}
                </td>
            </tr>`;
        })
        .join("");

    return `
    <div style="background-color:#f4f6f9;padding:40px 0;font-family:Arial,sans-serif;">

        <table align="center" width="600" cellpadding="0" cellspacing="0" style="
            background:white;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">

            <!-- HEADER -->
            <tr>
                <td style="background:#dc2626;padding:30px;text-align:center;color:white;">
                    <h1 style="margin-top:0;">SISPRAC</h1>
                    <p style="margin-bottom:0;">Gestión de prácticas profesionales</p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;margin-top:0;">
                        Nueva solicitud de visita
                    </h2>

                    <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                   <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                        El tutor docente <strong>${escapeHtml(nombreTutorDocente)}</strong>
                        ha solicitado una visita para ${esPlural ? "los siguientes practicantes" : "el siguiente practicante"}:
                    </p>    

                    <!-- PRACTICANTES -->
                    <div style="
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:18px 20px;
                        margin-top:25px;
                    ">
                        <p style="color:#6b7280;font-size:13px;margin:0 0 8px 0;">
                            ${esPlural ? "PRACTICANTES" : "PRACTICANTE"}
                        </p>
                        <ul style="color:#111827;font-size:15px;margin:0;padding-left:20px;">
                            ${listaPracticantes}
                        </ul>

                        <div style="
                            display:inline-block;
                            background:#fef3c7;
                            color:#d97706;
                            padding:6px 12px;
                            border-radius:20px;
                            font-size:12px;
                            font-weight:bold;
                            margin-top:12px;
                        ">
                            PENDIENTE DE RESPUESTA
                        </div>
                    </div>

                    <!-- DISPONIBILIDADES -->
                    <div style="
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        margin-top:25px;
                        overflow:hidden;
                    ">
                        <p style="
                            background:#f9fafb;
                            color:#6b7280;
                            font-size:13px;
                            margin:0;
                            padding:12px;
                        ">
                            DISPONIBILIDADES PROPUESTAS
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:8px 12px;font-size:13px;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb;">Fecha</td>
                                <td style="padding:8px 12px;font-size:13px;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb;">Horario</td>
                            </tr>
                            ${filasFechas}
                        </table>
                    </div>

                    <!-- ACCIÓN -->
                    <div style="
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">
                        <p style="color:#991b1b;font-weight:bold;margin:0 0 8px 0;">
                            Acción requerida
                        </p>
                        <p style="color:#7f1d1d;line-height:1.7;margin:0;">
                            Ingresa a SISPRAC, revisa la solicitud y selecciona
                            una de las disponibilidades propuestas.
                        </p>
                    </div>

                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="
                    background:#f9fafb;
                    padding:20px;
                    text-align:center;
                    color:#6b7280;
                    font-size:14px;
                ">
                    © 2026 SISPRAC. Todos los derechos reservados.
                </td>
            </tr>

        </table>
    </div>
    `;
};