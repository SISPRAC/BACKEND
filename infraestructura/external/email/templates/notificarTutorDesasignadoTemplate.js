
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const sispracTutorEmpresarialDesasignadoTemplate = ({
    nombreTutor,
    nombreEmpresa,
    nombreVacante,
    nombrePeriodo
}) => {

    const tutor = escapeHtml(nombreTutor);
    const empresa = escapeHtml(nombreEmpresa);
    const vacante = escapeHtml(nombreVacante);
    const periodo = escapeHtml(nombrePeriodo);

    return `
    <div style="background-color:#f4f6f9; padding:40px 0; font-family:Arial,sans-serif;">

        <table align="center" width="600"
            style="background:white; border-radius:12px; overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,0.1);">

            <tr>
                <td style="background:#dc2626; padding:30px;
                    text-align:center; color:white;">

                    <h1 style="margin:0; font-size:28px;">
                        SISPRAC
                    </h1>

                    <p style="margin-top:10px; font-size:16px;">
                        Sistema de Gestión de Prácticas
                    </p>

                </td>
            </tr>

            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Información sobre tu asignación como Tutor Empresarial
                    </h2>

                    <p style="color:#4b5563; line-height:1.7; font-size:16px;">

                        Hola <strong>${tutor}</strong>.

                        <br/><br/>

                        Te informamos que la apertura de vacante para la cual
                        habías sido asignado como <strong>Tutor Empresarial</strong>
                        ha sido <strong style="color:#dc2626;">eliminada</strong>
                        de la plataforma SISPRAC.

                        <br/><br/>

                        Por lo tanto, tu asignación como tutor empresarial
                        para esta apertura ha quedado sin efecto.

                    </p>

                    <div style="background:#fef2f2; padding:20px;
                        border-radius:8px; margin-top:20px;">

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Empresa:</strong> ${empresa}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Vacante:</strong> ${vacante}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Período de prácticas:</strong> ${periodo}
                        </p>

                    </div>

                    <p style="color:#4b5563; line-height:1.7;
                        font-size:16px; margin-top:25px;">

                        Esta notificación corresponde únicamente a la
                        apertura de vacante mencionada anteriormente.

                        <br/><br/>

                        Agradecemos tu disposición y compromiso con
                        el desarrollo de las prácticas profesionales.

                    </p>

                    <p style="color:#6b7280; font-size:14px;
                        line-height:1.6; margin-top:30px;">

                        Este es un mensaje automático generado por SISPRAC.
                        Por favor, no respondas a este correo.

                    </p>

                </td>
            </tr>

            <tr>
                <td style="background:#f9fafb; padding:20px;
                    text-align:center; color:#6b7280; font-size:14px;">

                    © 2026 SISPRAC. Todos los derechos reservados.

                </td>
            </tr>

        </table>

    </div>
    `;
};
