const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracEncuestaRespondidaTemplate = ({
    esEvaluacion,
    nombreDestinatario,
    nombrePracticante,
    rolRespondiente,        // NUEVO
    nombreRespondiente,
    nombreEmpresa,
    nombreEncuesta
}) => {

    const titulo = esEvaluacion
        ? "Evaluación del practicante respondida"
        : "Encuesta respondida por el practicante";

    const mensaje = esEvaluacion
        ? `${escapeHtml(rolRespondiente || "El evaluador")}${nombreRespondiente
            ? ` <strong>${escapeHtml(nombreRespondiente)}</strong>`
            : ""
        }${nombreEmpresa
            ? ` de la empresa <strong>${escapeHtml(nombreEmpresa)}</strong>`
            : ""
        } ha respondido la encuesta de evaluación del practicante
      <strong>${escapeHtml(nombrePracticante)}</strong>.`
        : `El practicante <strong>${escapeHtml(nombrePracticante)}</strong>
       ha respondido la encuesta sobre su práctica.`;

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

                    <h2 style="color:#111827;margin-top:0;">${titulo}</h2>

                    <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                    <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                        ${mensaje}
                    </p>

                    <div style="
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:18px 20px;
                        margin-top:25px;
                    ">
                        <p style="color:#6b7280;font-size:13px;margin:0 0 8px 0;">
                            ENCUESTA
                        </p>
                        <p style="color:#111827;font-size:17px;font-weight:bold;margin:0;">
                            ${escapeHtml(nombreEncuesta)}
                        </p>
                        <div style="
                            display:inline-block;
                            background:#dcfce7;
                            color:#15803d;
                            padding:6px 12px;
                            border-radius:20px;
                            font-size:12px;
                            font-weight:bold;
                            margin-top:12px;
                        ">
                            RESPONDIDA
                        </div>
                    </div>

                    <p style="color:#6b7280;line-height:1.7;font-size:14px;margin-top:25px;">
                        Ingresa a SISPRAC para consultar las respuestas.
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