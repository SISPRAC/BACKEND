export const sispracEmpresaInvitationTemplate = ({
    linkRegistro
}) => {

    return `
    <div style="
        background-color:#f3f4f6;
        padding:40px 15px;
        font-family:Arial, Helvetica, sans-serif;
    ">

        <table
            align="center"
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
                width:100%;
                max-width:600px;
                background:#ffffff;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 3px 12px rgba(0,0,0,0.08);
            "
        >

            <!-- HEADER -->
            <tr>
                <td style="
                    background:#dc2626;
                    padding:35px 25px;
                    text-align:center;
                    color:#ffffff;
                ">

                    <h1 style="
                        margin:0;
                        font-size:30px;
                        font-weight:bold;
                        letter-spacing:1px;
                    ">
                        SISPRAC
                    </h1>

                    <p style="
                        margin:10px 0 0;
                        font-size:16px;
                        color:#ffffff;
                    ">
                         Invitación a registrar su empresa
                    </p>


                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:35px 40px;">

                    <p style="
                        color:#374151;
                        line-height:1.8;
                        font-size:15px;
                        margin:0;
                    ">
                        Estimado representante empresarial:
                    </p>

                    <p style="
                        color:#4b5563;
                        line-height:1.8;
                        font-size:15px;
                        margin-top:15px;
                    ">
                        La <strong>Universidad Francisco de Paula Santander</strong>,
                        a través del <strong>Programa de Ingeniería de Sistemas</strong>,
                        le extiende una invitación para vincular su empresa a
                        <strong>SISPRAC</strong>, el Sistema de Gestión de Prácticas,
                        desarrollado para optimizar y facilitar los procesos
                        relacionados con las prácticas profesionales.
                    </p>

                    <p style="
                        color:#4b5563;
                        line-height:1.8;
                        font-size:15px;
                    ">
                        A través de esta plataforma, su empresa podrá participar
                        en la publicación de oportunidades de práctica, gestionar
                        procesos de selección, realizar seguimiento a los
                        practicantes y mantener una comunicación organizada
                        con la institución.
                    </p>

                    <p style="
                        color:#4b5563;
                        line-height:1.8;
                        font-size:15px;
                    ">
                        Para aceptar esta invitación y comenzar el proceso
                        de registro de su empresa, haga clic en el siguiente botón:
                    </p>

                    <!-- BUTTON -->
                    ${linkRegistro
            ? `
                            <div style="
                                text-align:center;
                                margin:30px 0;
                            ">

                                <a
                                    href="${linkRegistro}"
                                    target="_blank"
                                    style="
                                        background-color:#dc2626;
                                        color:#ffffff;
                                        padding:15px 32px;
                                        text-decoration:none;
                                        border-radius:8px;
                                        display:inline-block;
                                        font-size:15px;
                                        font-weight:bold;
                                    "
                                >
                                    Registrar mi empresa
                                </a>

                            </div>
                        `
            : `
                            <p style="
                                color:#dc2626;
                                text-align:center;
                                margin:25px 0;
                                font-size:14px;
                            ">
                                [Enlace de registro no disponible]
                            </p>
                        `
        }

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

                    <p style="
                        color:#6b7280;
                        line-height:1.7;
                        font-size:14px;
                        margin-top:25px;
                    ">
                        Agradecemos su interés en formar parte de este proceso
                        de articulación entre la universidad y el sector
                        empresarial. Esperamos que SISPRAC contribuya a
                        fortalecer la gestión de las prácticas profesionales
                        y las oportunidades de formación de nuestros estudiantes.
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
