
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const sispracTutorEmpresarialAsignadoTemplate = ({
    nombreTutor,
    nombreEmpresa,
    nombreVacante,
    nombrePeriodo,
    cupos,
    fechaInicio,
    fechaFin
}) => {

    const tutor = escapeHtml(nombreTutor);
    const empresa = escapeHtml(nombreEmpresa);
    const vacante = escapeHtml(nombreVacante);
    const periodo = escapeHtml(nombrePeriodo);
    const cantidadCupos = escapeHtml(cupos);
    const inicio = escapeHtml(fechaInicio);
    const fin = escapeHtml(fechaFin);

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
                        ¡Has sido asignado como Tutor Empresarial!
                    </h2>

                    <p style="color:#4b5563; line-height:1.7; font-size:16px;">

                        Hola <strong>${tutor}</strong>.

                        <br/><br/>

                        Te informamos que has sido asignado como
                        <strong>Tutor Empresarial</strong> para acompañar
                        el proceso de prácticas profesionales en la empresa
                        <strong>${empresa}</strong>.

                        <br/><br/>

                        La asignación corresponde a la siguiente apertura
                        de vacante:

                    </p>

                    <div style="background:#f9fafb; padding:20px;
                        border-radius:8px; margin-top:20px;">

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Vacante:</strong> ${vacante}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Período de prácticas:</strong> ${periodo}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Cupos disponibles:</strong>
                            ${cantidadCupos}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Fecha de inicio:</strong> ${inicio}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Fecha de finalización:</strong> ${fin}
                        </p>

                    </div>

                    <p style="color:#4b5563; line-height:1.7;
                        font-size:16px; margin-top:25px;">

                        Agradecemos tu disposición y compromiso para
                        acompañar y orientar a los practicantes durante
                        el desarrollo de sus prácticas profesionales.

                        <br/><br/>

                        Puedes ingresar a la plataforma
                        <strong>SISPRAC</strong> para consultar
                        la información correspondiente.

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
