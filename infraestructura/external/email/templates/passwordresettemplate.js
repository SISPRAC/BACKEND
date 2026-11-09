export const passwordResetTemplate = ({
    nombre,
    link,
    minutos = 15
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
                    <h1 style="margin:0; font-size:30px;">
                        Recuperar contraseña
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
                        Solicitud de cambio de contraseña
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Hola
                        <strong style="color:#111827;">${nombre}</strong>,
                        recibimos una solicitud para restablecer la
                        contraseña de tu cuenta en <strong>SISPRAC</strong>.

                        <br/><br/>

                        Haz clic en el siguiente botón para crear una
                        nueva contraseña. El enlace es válido por
                        <strong>${minutos} minutos</strong> y solo puede
                        usarse una vez.
                    </p>

                    <div style="text-align:center; margin-top:30px;">
                        <a
                            href="${link}"
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
                            Restablecer contraseña
                        </a>
                    </div>

                    <p style="
                        color:#6b7280;
                        line-height:1.6;
                        font-size:14px;
                        margin-top:35px;
                    ">
                        Si no solicitaste este cambio, ignora este
                        mensaje: tu contraseña actual seguirá siendo la
                        misma.
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