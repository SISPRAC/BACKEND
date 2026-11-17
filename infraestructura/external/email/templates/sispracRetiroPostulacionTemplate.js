
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracRetiroPostulacionTemplate = ({
    nombreEmpresa,
    nombrePracticante,
    codigo,
    nombreVacante
}) => {

    return `
    <div style="
        background-color:#f4f6f9;
        padding:40px 0;
        font-family:Arial,sans-serif;
    ">

        <table align="center" width="600" cellpadding="0"
            cellspacing="0" style="
                background:white;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 2px 10px rgba(0,0,0,0.1);
            ">

            <tr>
                <td style="
                   background:#dc2626;
                    padding:30px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin-top:0;">SISPRAC</h1>
                    <p style="margin-bottom:0;">
                        Actualización de postulaciones
                    </p>
                </td>
            </tr>

            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Actualización de candidato asignado
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a) representante de
                        <strong>${escapeHtml(nombreEmpresa)}</strong>:
                        <br/><br/>

                        Te informamos que, por decisión de la dirección
                        del programa, se ha retirado al practicante
                        <strong>${escapeHtml(nombrePracticante)}</strong>,
                        identificado con el código
                        <strong>${escapeHtml(codigo)}</strong>,
                        de la vacante
                        <strong>${escapeHtml(nombreVacante)}</strong>.
                    </p>

                    <div style="
                        background:#eff6ff;
                        border:1px solid #bfdbfe;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">

                        <h3 style="
                            color:#1e40af;
                            margin-top:0;
                        ">
                            Información importante
                        </h3>

                        <p style="
                            color:#1e3a8a;
                            line-height:1.7;
                            margin-bottom:0;
                        ">
                            El practicante ya no continuará en el proceso
                            de selección para esta vacante, debido a una
                            actualización en su asignación de prácticas
                            profesionales.
                        </p>

                    </div>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                        margin-top:25px;
                    ">
                        Puedes ingresar a SISPRAC para consultar
                        el estado actualizado de tus postulaciones
                        y vacantes.
                    </p>

                </td>
            </tr>

            <tr>
                <td style="
                    background:#f9fafb;
                    padding:20px;
                    text-align:center;
                    color:#6b7280;
                    font-size:14px;
                ">
                    © 2026 SISPRAC. Todos los derechos reservados.
                    <br/>
                    Sistema de Gestión de Prácticas Profesionales
                </td>
            </tr>

        </table>
    </div>
    `;
};
