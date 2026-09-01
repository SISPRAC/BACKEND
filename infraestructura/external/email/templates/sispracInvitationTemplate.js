export const sispracInvitationTemplate = ({
    codigo,
    nombre,
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
                    background:#e8192c;
                    padding:30px;
                    text-align:center;
                    color:white;
                ">

                    <h1 style="
                        margin:0;
                        font-size:30px;
                    ">
                        Bienvenido a SISPRAC
                    </h1>

                    <p style="
                        margin-top:10px;
                        font-size:16px;
                    ">
                        Sistema de Gestión de Prácticas
                    </p>

                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Invitación a continuar su proceso
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">

                        Estimado(a)
                        <strong style="color:#111827;">
                            ${nombre}
                        </strong>,
                        identificado(a) con el código estudiantil
                        <strong style="color:#e8192c;">
                            ${codigo}
                        </strong>:

                        <br/><br/>

                        Le damos la bienvenida a
                        <strong>SISPRAC</strong>.

                        <br/><br/>

                        Su registro ha sido habilitado para continuar
                        con el proceso de prácticas en nuestra plataforma.

                        <br/><br/>

                        Para continuar con el proceso, complete su
                        inscripción mediante el siguiente enlace:

                    </p>

                    ${
                        linkInscripcion
                        ? `
                            <div style="
                                text-align:center;
                                margin-top:30px;
                            ">

                                <a
                                    href="${linkInscripcion}"
                                    style="
                                        background:#e8192c;
                                        color:white;
                                        padding:14px 24px;
                                        text-decoration:none;
                                        border-radius:8px;
                                        display:inline-block;
                                        font-weight:bold;
                                    "
                                >
                                    Continuar mi inscripción
                                </a>

                            </div>
                        `
                        : `
                            <p style="
                                color:#dc2626;
                                text-align:center;
                                margin-top:20px;
                            ">
                                [Espacio para colocar el enlace de inscripción]
                            </p>
                        `
                    }

                    <p style="
                        color:#6b7280;
                        line-height:1.6;
                        font-size:14px;
                        margin-top:35px;
                    ">

                        Si usted no esperaba recibir este mensaje,
                        puede ignorarlo.

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