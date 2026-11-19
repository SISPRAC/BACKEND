const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracVisitaRealizadaTemplate = ({
    nombreDestinatario,
    esDirector,
    esActualizacion,
    nombreTutorDocente,
    nombreEmpresa,
    nombresPracticantes = [],
    fechaRealizada
}) => {

    const esPlural = nombresPracticantes.length > 1;

    const titulo = esActualizacion
        ? "Visita de seguimiento actualizada"
        : "Visita de seguimiento realizada";

    const verbo = esActualizacion ? "ha actualizado" : "ha registrado";

    const listaPracticantes = nombresPracticantes
        .map((n) => `<li style="margin-bottom:4px;">${escapeHtml(n)}</li>`)
        .join("");

    const mensajeFinal = esDirector
        ? "Puedes consultar la información de la visita en SISPRAC."
        : "Ingresa a SISPRAC para consultar la información de la visita realizada a tu empresa.";

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

                    <h2 style="color:#111827;margin-top:0;">${titulo}</h2>

                    <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                    <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                        El tutor docente <strong>${escapeHtml(nombreTutorDocente)}</strong>
                        ${verbo} la visita de seguimiento a la empresa
                        <strong>${escapeHtml(nombreEmpresa)}</strong>.
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
                        <p style="color:#6b7280;font-size:13px;margin:12px 0 0 0;">
                            Empresa: <strong style="color:#111827;">${escapeHtml(nombreEmpresa)}</strong>
                        </p>
                    </div>

                    <!-- FECHA -->
                    <div style="
                        background:#f0fdf4;
                        border:1px solid #bbf7d0;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">
                        <p style="color:#166534;font-weight:bold;margin:0 0 8px 0;">
                            Fecha de registro
                        </p>
                        <p style="color:#14532d;margin:0;font-size:16px;">
                            <strong>${escapeHtml(fechaRealizada)}</strong>
                        </p>
                    </div>

                    <p style="color:#6b7280;line-height:1.7;font-size:14px;margin-top:25px;">
                        ${mensajeFinal}
                    </p>

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