
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const sispracConvenioAprobadoTemplate = ({
    nombreRepresentante,
    nombreEmpresa
}) => {

    const representante = escapeHtml(nombreRepresentante);
    const empresa = escapeHtml(nombreEmpresa);

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
                        ¡Tu convenio ha sido aprobado!
                    </h2>

                    <p style="color:#4b5563; line-height:1.7; font-size:16px;">

                        Hola <strong>${representante}</strong>.

                        <br/><br/>

                        Nos complace informarte que el convenio de tu empresa
                        <strong>${empresa}</strong> ha sido
                        <strong style="color:#16a34a;">APROBADO</strong>
                        por el Programa de Ingeniería de Sistemas de la
                        Universidad Francisco de Paula Santander.

                        <br/><br/>

                        El documento del convenio firmado ha sido registrado
                        correctamente en la plataforma SISPRAC.

                    </p>

                    <div style="background:#f0fdf4; padding:20px;
                        border-radius:8px; margin-top:20px;">

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Empresa:</strong> ${empresa}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Estado del convenio:</strong>
                            <span style="color:#16a34a; font-weight:bold;">
                                APROBADO
                            </span>
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Documento firmado:</strong>
                            Registrado en SISPRAC
                        </p>

                    </div>

                    <p style="color:#4b5563; line-height:1.7;
                        font-size:16px; margin-top:25px;">

                        Te invitamos a ingresar a la plataforma
                        <strong>SISPRAC</strong> para consultar el estado
                        de tu convenio y acceder al documento firmado.

                        <br/><br/>

                        Agradecemos tu interés y disposición para
                        establecer vínculos de cooperación que contribuyan
                        al desarrollo de las prácticas profesionales
                        de nuestros estudiantes.

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
