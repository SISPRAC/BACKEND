
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const sispracTutorDocenteDesasignadoTemplate = ({
    nombreTutor,
    nombreGrupo,
    nombrePeriodo,
    motivo = "CAMBIO_TUTOR"
}) => {

    const tutor = escapeHtml(nombreTutor);
    const grupo = escapeHtml(nombreGrupo);
    const periodo = escapeHtml(nombrePeriodo);

    const esEliminacion = motivo === "ELIMINACION_GRUPO";

    const titulo = esEliminacion
        ? "Información sobre la eliminación de un grupo"
        : "Información sobre tu asignación como Tutor Docente";

    const mensaje = esEliminacion
        ? `
            Te informamos que el grupo
            <strong style="color:#dc2626;">${grupo}</strong>,
            en el cual estabas asignado como
            <strong>Tutor Docente</strong>, ha sido
            <strong style="color:#dc2626;">eliminado</strong>
            de la plataforma SISPRAC.

            <br/><br/>

            Como consecuencia de esta eliminación, tu asignación
            como Tutor Docente de este grupo ha finalizado.
        `
        : `
            Te informamos que has sido
            <strong style="color:#dc2626;">desasignado</strong>
            como <strong>Tutor Docente</strong> del siguiente
            grupo en la plataforma SISPRAC.

            <br/><br/>

            Por lo tanto, ya no tienes asignado el
            acompañamiento de este grupo de practicantes.
        `;

    const informacionAdicional = esEliminacion
        ? `
            Esta notificación corresponde a la eliminación
            del grupo indicado anteriormente.
        `
        : `
            Esta modificación corresponde a un cambio
            en la asignación del Tutor Docente del grupo.
        `;

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
                        ${titulo}
                    </h2>

                    <p style="color:#4b5563; line-height:1.7; font-size:16px;">

                        Hola <strong>${tutor}</strong>.

                        <br/><br/>

                        ${mensaje}

                    </p>

                    <div style="background:#fef2f2; padding:20px;
                        border-radius:8px; margin-top:20px;">

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Grupo:</strong> ${grupo}
                        </p>

                        <p style="color:#374151; margin:8px 0;">
                            <strong>Período de prácticas:</strong> ${periodo}
                        </p>

                    </div>

                    <p style="color:#4b5563; line-height:1.7;
                        font-size:16px; margin-top:25px;">

                        ${informacionAdicional}

                        <br/><br/>

                        Agradecemos tu disposición y compromiso
                        con el acompañamiento de los procesos
                        de prácticas profesionales.

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
