import Logo from "../../../../assets/Logo.png"

export const sispracInvitationTemplate = ({
    codigo,
    nombreCompleto,
    linkInscripcion
}) => {

    return `
    
    <div style="
        background-color:#f4f6f9;
        padding:40px 0;
        font-family:Arial, sans-serif;
    ">

        <table 
            align="center"
            width="600"
            style="
                background:white;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 2px 10px rgba(0,0,0,0.1);
            "
        >

            <!-- HEADER -->
            <tr>
                <td style="
                    background:#2563eb;
                    padding:30px;
                    text-align:center;
                    color:white;
                ">
                    
                    <!-- LOGO -->
                    <img 
                        src={Logo}
                        alt="Logo"
                        width="80"
                        height="80"
                        style="
                            border-radius:50%;
                            background:white;
                            object-fit:cover;
                        "
                    />

                    <h1 style="margin-top:20px;">
                        Mi SISPRAC
                    </h1>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Invitación a inscripción en SISPRAC
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a) <strong>${nombreCompleto}</strong>,<br/><br/>
                        Con el código <strong>${codigo}</strong> ha sido registrado como candidato para continuar con su proceso de prácticas en el sistema SISPRAC. 
                        Para avanzar, es necesario realizar su inscripción en el siguiente enlace:
                    </p>

                    ${
                        linkInscripcion
                        ? `
                            <div style="text-align:center; margin-top:30px;">
                                <a 
                                    href="${linkInscripcion}"
                                    style="
                                        background:#2563eb;
                                        color:white;
                                        padding:14px 24px;
                                        text-decoration:none;
                                        border-radius:8px;
                                        display:inline-block;
                                        font-weight:bold;
                                    "
                                >
                                    Inscribirme en SISPRAC
                                </a>
                            </div>
                        `
                        : '<p style="color:#dc2626; text-align:center; margin-top:20px;">[Espacio para colocar el link de inscripción]</p>'
                    }

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
