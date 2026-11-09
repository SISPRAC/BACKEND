export const passwordChangedTemplate = ({
    nombre,
    fecha,
    loginLink
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
                        Contraseña actualizada
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
                        Tu contraseña fue cambiada
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Hola
                        <strong style="color:#111827;">${nombre}</strong>,
                        te confirmamos que la contraseña de tu cuenta en
                        <strong>SISPRAC</strong> fue cambiada
                        correctamente el
                        <strong>${fecha}</strong>.

                        <br/><br/>

                        Ya puedes iniciar sesión con tu nueva contraseña.
                    </p>

                    ${
                        loginLink
                        ? `
                            <div style="text-align:center; margin-top:30px;">
                                <a
                                    href="${loginLink}"
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
                                    Iniciar sesión
                                </a>
                            </div>
                        `
                        : ""
                    }

                    <!-- AVISO DE SEGURIDAD -->
                    <div style="
                        background:#fef2f2;
                        border-left:4px solid #e8192c;
                        border-radius:6px;
                        padding:16px 20px;
                        margin-top:35px;
                    ">
                        <p style="
                            margin:0;
                            color:#991b1b;
                            line-height:1.6;
                            font-size:14px;
                        ">
                            <strong>¿No fuiste tú?</strong><br/>
                            Si no realizaste este cambio, tu cuenta podría
                            estar en riesgo. Restablece tu contraseña de
                            inmediato desde la opción "¿Olvidaste la
                            contraseña?" y comunícate con el administrador
                            de SISPRAC.
                        </p>
                    </div>

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