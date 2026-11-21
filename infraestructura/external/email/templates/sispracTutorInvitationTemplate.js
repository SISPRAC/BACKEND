const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const sispracTutorEmpresarialInvitationTemplate = ({
    linkRegistro,
    nombreEmpresa
}) => {

    const empresa = escapeHtml(nombreEmpresa);

    return `
    <div style="background-color:#f4f6f9; padding:40px 0; font-family:Arial, sans-serif;">

        <table align="center" width="600" style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">

            <!-- HEADER -->
            <tr>
                <td style="background:#dc2626; padding:30px; text-align:center; color:white;">
                    <h1 style="margin:0; font-size:30px;">
                        Bienvenido a SISPRAC
                    </h1>
                    <p style="margin-top:10px; font-size:16px;">
                        Sistema de Gestión de Prácticas
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Invitación como Tutor Empresarial
                    </h2>

                    <p style="color:#4b5563; line-height:1.7; font-size:16px;">

                        Reciba un cordial saludo.

                        <br/><br/>

                      La empresa <strong>${empresa}</strong> lo(la) invita a
                        participar como <strong>Tutor Empresarial</strong> en el
                        proceso de prácticas empresariales del programa de
                        <strong>Ingeniería de Sistemas</strong> de la
                        <strong>Universidad Francisco de Paula Santander</strong>,
                        desarrollado en el marco del convenio entre la universidad
                        y la empresa, a través de la plataforma <strong>SISPRAC</strong>.
                        <br/><br/>

                        Para continuar, complete la creación de su cuenta
                        mediante el siguiente enlace:

                    </p>

                    <div style="text-align:center; margin-top:30px;">
                        <a
                            href="${linkRegistro}"
                            style="background:#dc2626; color:white; padding:14px 24px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;"
                        >
                            Completar mi registro
                        </a>
                    </div>

                    <p style="color:#6b7280; line-height:1.6; font-size:14px; margin-top:35px;">
                        Si usted no esperaba recibir esta invitación,
                        puede ignorar este mensaje.
                    </p>

                    <!-- EXPIRATION NOTICE -->
                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            background:#fef2f2;
                            border:1px solid #fecaca;
                            border-radius:8px;
                        "
                    >
                        <tr>
                            <td style="padding:18px;">

                                <p style="
                                    margin:0 0 8px;
                                    color:#991b1b;
                                    font-size:15px;
                                    font-weight:bold;
                                ">
                                    Vigencia de la invitación
                                </p>

                                <p style="
                                    margin:0;
                                    color:#7f1d1d;
                                    font-size:14px;
                                    line-height:1.7;
                                ">
                                    Esta invitación tiene una vigencia de
                                    <strong>3 días (72 horas)</strong> a partir
                                    de su generación. Una vez transcurrido este
                                    plazo, el enlace de registro expirará y
                                    el token dejará de ser válido.
                                </p>

                            </td>
                        </tr>
                    </table>

                </td>
            </tr> 


            <!-- FOOTER -->
            <tr>
                <td style="background:#f9fafb; padding:20px; text-align:center; color:#6b7280; font-size:14px;">
                    © 2026 SISPRAC. Todos los derechos reservados.
                </td>
            </tr>

        </table>

    </div>
    `;
};