

export const sispracAceptacionTemplate = ({
    nombreDestinatario,
    nombrePracticante,
    codigo,
    nombreVacante,
    nombreEmpresa,
    nombreDirector,
    nombreTutor,
    destinatarioTipo
}) => {

    const mensajes = {
        candidato: {
            titulo: "¡Has sido seleccionado para realizar tus prácticas profesionales!",
            mensaje: `
        Nos complace informarte que has sido seleccionado(a) para
        realizar tus prácticas profesionales en
        <strong>${nombreEmpresa}</strong>, en el marco de la vacante
        <strong>${nombreVacante}</strong>.

        <br/><br/>

        A partir de este momento, iniciarás tu proceso de prácticas
        profesionales en SISPRAC. Te deseamos muchos éxitos en esta
        nueva etapa de formación y experiencia profesional.

        <br/><br/>

        ¡Felicitaciones por este logro!
    `
        },

        director: {
            titulo: "Confirmación de aceptación de practicante",
            mensaje: `
                Se informa que el candidato(a)
                <strong>${nombrePracticante}</strong>, identificado(a)
                con el código <strong>${codigo}</strong>, ha sido
                seleccionado(a) y su postulación ha sido aceptada
                para realizar sus prácticas profesionales en
                <strong>${nombreEmpresa}</strong>, en la vacante
                <strong>${nombreVacante}</strong>.
            `
        },

        empresa: {
            titulo: "Confirmación de practicante seleccionado",
            mensaje: `
                Nos complace confirmar que el candidato(a)
                <strong>${nombrePracticante}</strong>, identificado(a)
                con el código <strong>${codigo}</strong>, ha sido
                aceptado(a) para ocupar la vacante
                <strong>${nombreVacante}</strong> en su empresa.
                <br/><br/>
                Con esta aceptación se confirma su selección
                para continuar con el proceso de prácticas profesionales.
            `
        },

        tutor: {
            titulo: "Asignación de nuevo practicante",
            mensaje: `
                Le informamos que el practicante
                <strong>${nombrePracticante}</strong>, identificado(a)
                con el código <strong>${codigo}</strong>, ha sido
                aceptado(a) para realizar sus prácticas profesionales
                en <strong>${nombreEmpresa}</strong>, en la vacante
                <strong>${nombreVacante}</strong>.
                <br/><br/>
                Usted ha sido registrado(a) como tutor empresarial
                para acompañar su proceso de prácticas.
            `
        }
    };

    const contenido = mensajes[destinatarioTipo] || mensajes.candidato;

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
                    background:#2563eb;
                    padding:30px;
                    text-align:center;
                    color:white;
                ">

                    
                    <h1 style="margin-top:20px;">
                        Mi SISPRAC
                    </h1>

                    <p style="margin-bottom:0;">
                        Confirmación de aceptación
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        ${contenido.titulo}
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a)
                        <strong>${nombreDestinatario}</strong>,
                        <br/><br/>

                        ${contenido.mensaje}
                    </p>

                    <!-- INFORMACIÓN DE LA POSTULACIÓN -->
                    <div style="
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">

                        <h3 style="
                            color:#111827;
                            margin-top:0;
                        ">
                            Información de la práctica
                        </h3>

                        <p style="color:#4b5563;line-height:1.8;">
                            <strong>Practicante:</strong>
                            ${nombrePracticante}<br/>

                            <strong>Código:</strong>
                            ${codigo}<br/>

                            <strong>Vacante:</strong>
                            ${nombreVacante}<br/>

                            <strong>Empresa:</strong>
                            ${nombreEmpresa}<br/>

                            ${nombreDirector ? `
                                <strong>Director de programa:</strong>
                                ${nombreDirector}<br/>
                            ` : ""}

                            ${nombreTutor ? `
                                <strong>Tutor empresarial:</strong>
                                ${nombreTutor}<br/>
                            ` : ""}

                        </p>
                    </div>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                        margin-top:25px;
                    ">
                        Esta notificación ha sido generada
                        automáticamente por el sistema SISPRAC
                        como constancia de la aceptación de la
                        postulación.
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
