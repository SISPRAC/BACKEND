
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const sispracConvenioRechazadoTemplate = ({
    nombreRepresentante,
    nombreEmpresa,
    motivo
}) => {

    const representante = escapeHtml(nombreRepresentante);
    const empresa = escapeHtml(nombreEmpresa);
    const comentario = escapeHtml(motivo);

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
                        Información sobre tu convenio
                    </h2>

                    <p style="color:#4b5563; line-height:1.7; font-size:16px;">

                        Hola <strong>${representante}</strong>.

                        <br/><br/>

                        Te informamos que el convenio presentado por tu empresa
                        <strong>${empresa}</strong> ha sido
                        <strong style="color:#dc2626;">RECHAZADO</strong>
                        por el Programa de Ingeniería de Sistemas de la
                        Universidad Francisco de Paula Santander.

                        <br/><br/>

                        A continuación, te compartimos el motivo
                        registrado durante la revisión:

                    </p>

                        <div style="
                        background-color:#fef2f2;
                        padding:20px;
                        border-radius:8px;
                        margin-top:20px;
                        border-left:4px solid #dc2626;
                    ">

                        <p style="
                            color:#991b1b;
                            margin:0 0 12px 0;
                            font-weight:bold;
                            font-size:15px;
                        ">
                            Motivo del rechazo:
                        </p>

                        <div style="
                            color:#374151;
                            font-size:15px;
                            line-height:1.7;
                            margin:0;
                            white-space:normal;
                            word-wrap:break-word;
                            overflow-wrap:anywhere;
                        ">
                            ${comentario.replace(/\r\n|\r|\n/g, "<br/>")}
                        </div>

                    </div>

                    <p style="color:#4b5563; line-height:1.7;
                        font-size:16px; margin-top:25px;">

                        Te invitamos a ingresar a la plataforma
                        <strong>SISPRAC</strong> para consultar el estado
                        del convenio y las observaciones realizadas.

                        <br/><br/>

                        Una vez identificadas las observaciones, podrás
                        realizar los ajustes correspondientes y continuar
                        con el proceso de revisión del convenio.

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
