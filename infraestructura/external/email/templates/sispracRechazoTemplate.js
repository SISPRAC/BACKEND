
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracRechazoTemplate = ({
    nombreDirector,
    nombrePracticante,
    codigo,
    nombreEmpresa,
    nombreVacante,
    motivo
}) => {

    return `
    <div style="
        background-color:#f4f6f9;
        padding:40px 0;
        font-family:Arial,sans-serif;
    ">

        <table align="center" width="600" cellpadding="0"
            cellspacing="0" style="
                background:white;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 2px 10px rgba(0,0,0,0.1);
            ">

            <!-- HEADER -->
            <tr>
                <td style="
                    background:#dc2626;
                    padding:30px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin-top:0;">
                        SISPRAC
                    </h1>

                    <p style="margin-bottom:0;">
                        Notificación de postulación rechazada
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Postulación rechazada
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a) <strong>${escapeHtml(nombreDirector)}</strong>:
                        <br/><br/>

                        Te informamos que la postulación del candidato
                        <strong>${escapeHtml(nombrePracticante)}</strong>,
                        identificado con el código
                        <strong>${escapeHtml(codigo)}</strong>,
                        ha sido rechazada por la empresa
                        <strong>${escapeHtml(nombreEmpresa)}</strong>,
                        para la vacante
                        <strong>${escapeHtml(nombreVacante)}</strong>.
                    </p>

                    <!-- MOTIVO -->
                    <div style="
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">

                        <h3 style="
                            color:#991b1b;
                            margin-top:0;
                        ">
                            Motivo del rechazo
                        </h3>

                        <p style="
                            color:#7f1d1d;
                            line-height:1.7;
                            margin-bottom:0;
                            white-space:pre-line;
                        ">
                            ${escapeHtml(motivo || "La empresa no proporcionó un motivo.")}
                        </p>

                    </div>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                        margin-top:25px;
                    ">
                        Puedes ingresar a SISPRAC para consultar
                        los detalles de la postulación y realizar
                        el seguimiento correspondiente.
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
                    <br/>
                    Sistema de Gestión de Prácticas Profesionales
                </td>
            </tr>

        </table>
    </div>
    `;
};
