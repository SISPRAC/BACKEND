const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracRetiroPracticanteTemplate = ({
    nombreDestinatario,
    esPracticante,
    retiradoPor,
    nombrePracticante,
    nombreEmpresa,
    motivo,
    fecha
}) => {

    const lamento = esPracticante
        ? "Lamentamos informarte que"
        : "Lamentamos informarte que";

    const hecho = {
        PRACTICANTE: `el practicante <strong>${escapeHtml(nombrePracticante)}</strong> se ha retirado de su práctica en la empresa <strong>${escapeHtml(nombreEmpresa)}</strong>`,
        EMPRESA: `la empresa <strong>${escapeHtml(nombreEmpresa)}</strong> ha retirado al practicante <strong>${escapeHtml(nombrePracticante)}</strong> de su práctica`,
        DIRECTOR: `el director del programa ha retirado al practicante <strong>${escapeHtml(nombrePracticante)}</strong> de su práctica en la empresa <strong>${escapeHtml(nombreEmpresa)}</strong>`
    }[retiradoPor];

    const cierre = esPracticante
        ? "Si tienes dudas sobre esta decisión, comunícate con la dirección del programa."
        : "Ingresa a SISPRAC para consultar la información del retiro.";

    return `
    <div style="background-color:#f4f6f9;padding:40px 0;font-family:Arial,sans-serif;">

        <table align="center" width="600" cellpadding="0" cellspacing="0" style="
            background:white;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">

            <tr>
                <td style="background:#dc2626;padding:30px;text-align:center;color:white;">
                    <h1 style="margin-top:0;">SISPRAC</h1>
                    <p style="margin-bottom:0;">Gestión de prácticas profesionales</p>
                </td>
            </tr>

            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;margin-top:0;">Retiro de practicante</h2>

                    <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                    <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                        ${lamento} ${hecho}.
                    </p>

                    <div style="
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">
                        <p style="color:#991b1b;font-weight:bold;margin:0 0 8px 0;">
                            Motivo del retiro
                        </p>
                        <p style="color:#7f1d1d;line-height:1.7;margin:0;">
                            ${escapeHtml(motivo || "Sin motivo especificado.")}
                        </p>
                        <p style="color:#7f1d1d;font-size:13px;margin:12px 0 0 0;">
                            Fecha del retiro: <strong>${escapeHtml(fecha)}</strong>
                        </p>
                    </div>

                    <p style="color:#6b7280;line-height:1.7;font-size:14px;margin-top:25px;">
                        ${cierre}
                    </p>

                </td>
            </tr>

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