export const sispracEmpresaInvitationTemplate = ({
    nombreEmpresa,
    linkRegistro
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
                    padding:35px;
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
                        Invitación para vincular a su empresa
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">

                        Estimados representantes de
                        <strong>${nombreEmpresa}</strong>:

                        <br/><br/>

                        Es un placer darle la bienvenida a
                        <strong>SISPRAC</strong>, una plataforma diseñada
                        para facilitar la gestión, seguimiento y
                        coordinación de los procesos relacionados con
                        las prácticas profesionales.

                        <br/><br/>

                        A través de SISPRAC, las empresas podrán participar
                        en la gestión de oportunidades de práctica,
                        realizar el seguimiento de los procesos de
                        selección y mantener una comunicación organizada
                        con los demás actores involucrados.

                        <br/><br/>

                        Para comenzar a utilizar la plataforma y completar
                        el registro de su empresa, le invitamos a ingresar
                        mediante el siguiente enlace:

                    </p>

                    ${
                        linkRegistro
                        ? `
                            <div style="
                                text-align:center;
                                margin-top:30px;
                            ">

                                <a
                                    href="${linkRegistro}"
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
                                    Registrar empresa
                                </a>

                            </div>
                        `
                        : `
                            <p style="
                                color:#dc2626;
                                text-align:center;
                                margin-top:20px;
                            ">
                                [Espacio para colocar el enlace de registro]
                            </p>
                        `
                    }

                    <p style="
                        color:#6b7280;
                        line-height:1.6;
                        font-size:14px;
                        margin-top:35px;
                    ">

                        Agradecemos su participación y esperamos que
                        SISPRAC contribuya a fortalecer la gestión de
                        las prácticas y la relación entre la institución,
                        los estudiantes y las empresas.

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