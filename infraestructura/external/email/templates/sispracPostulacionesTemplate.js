const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracPostulacionesTemplate = ({
    nombreEmpresa,
    nombreVacante,
    candidatos,
    cantidad
}) => {

    const esSingular = cantidad === 1;

    const listaCandidatos = candidatos.map((candidato) => `
        <tr>
            <td style="
                padding:12px;
                border-bottom:1px solid #e5e7eb;
                color:#374151;
            ">
                ${escapeHtml(candidato.nombre)}
            </td>

            <td style="
                padding:12px;
                border-bottom:1px solid #e5e7eb;
                color:#374151;
            ">
                ${escapeHtml(candidato.codigo)}
            </td>
        </tr>
    `).join("");

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

            <!-- HEADER -->
            <tr>
                <td style="
                    background:#dc2626;
                    padding:30px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin-top:0;">
                        SISPRAC
                    </h1>

                    <p style="margin-bottom:0;">
                        Notificación de ${esSingular ? "nueva postulación" : "nuevas postulaciones"}
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        ¡Tienes ${esSingular ? "un nuevo candidato postulado" : "nuevos candidatos postulados"}!
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a) representante de
                        <strong>${escapeHtml(nombreEmpresa)}</strong>:
                        <br/><br/>

                        Te informamos que se ha registrado
                        <strong>${cantidad}</strong>
                        ${esSingular ? "candidato" : "candidatos"}
                        ${esSingular ? "para postularse" : "para postularse"}
                        a la vacante
                        <strong>${escapeHtml(nombreVacante)}</strong>
                        en tu empresa.
                    </p>

                    <!-- INFORMACIÓN DE POSTULACIONES -->
                    <div style="
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">

                        <h3 style="color:#111827;margin-top:0;">
                            ${esSingular ? "Candidato postulado" : "Candidatos postulados"}
                        </h3>

                        <table width="100%" cellpadding="0"
                            cellspacing="0" style="
                                border-collapse:collapse;
                                background:white;
                            ">

                            <tr style="background:#eff6ff;">
                                <th align="left" style="padding:12px;">
                                    Nombre
                                </th>

                                <th align="left" style="padding:12px;">
                                    Código
                                </th>
                            </tr>

                            ${listaCandidatos}

                        </table>
                    </div>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                        margin-top:25px;
                    ">
                        Puedes ingresar a SISPRAC para consultar
                        la información de ${esSingular ? "esta postulación" : "estas postulaciones"}
                        y realizar ${esSingular ? "el seguimiento correspondiente" : "los seguimientos correspondientes"}.
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
                    <br/>
                    Sistema de Gestión de Prácticas Profesionales
                </td>
            </tr>

        </table>
    </div>
    `;
};
