const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracRevisionInformeTemplate = ({
    nombreDestinatario,
    nombrePracticante,
    nombreTutorDocente,
    estado,
    observacion,
    esPracticante
}) => {

    const aprobado = estado === "APROBADO";

    const tema = aprobado
        ? {
            header: "#16a34a",
            titulo: "Informe aprobado",
            cajaFondo: "#f0fdf4",
            cajaBorde: "#bbf7d0",
            cajaTitulo: "#166534",
            cajaTexto: "#14532d",
            resultado: "<strong>aprobado</strong>"
        }
        : {
            header: "#dc2626",
            titulo: "Informe rechazado",
            cajaFondo: "#fef2f2",
            cajaBorde: "#fecaca",
            cajaTitulo: "#991b1b",
            cajaTexto: "#7f1d1d",
            resultado: "<strong>rechazado</strong>"
        };

    const sujeto = esPracticante
        ? "tu entrega del informe"
        : `la entrega del informe del practicante <strong>${escapeHtml(nombrePracticante)}</strong>`;

    const revisor = nombreTutorDocente
        ? ` por el tutor docente <strong>${escapeHtml(nombreTutorDocente)}</strong>`
        : " por el tutor docente";

    let cierre;

    if (aprobado) {
        cierre = "No es necesaria ninguna acción adicional sobre esta entrega.";
    } else if (esPracticante) {
        cierre = "Ingresa a SISPRAC, corrige el informe según las observaciones y vuelve a realizar la entrega.";
    } else {
        cierre = "El practicante deberá corregir el informe y realizar una nueva entrega. Podrás hacer el seguimiento desde SISPRAC.";
    }

    const bloqueObservacion = observacion
        ? `
                    <div style="
                        background:${tema.cajaFondo};
                        border:1px solid ${tema.cajaBorde};
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">

                        <h3 style="
                            color:${tema.cajaTitulo};
                            margin-top:0;
                        ">
                            ${aprobado ? "Observación del tutor docente" : "Motivo del rechazo"}
                        </h3>

                        <p style="
                            color:${tema.cajaTexto};
                            line-height:1.7;
                            margin-bottom:0;
                            white-space:pre-line;
                        ">
                            ${escapeHtml(observacion)}
                        </p>

                    </div>`
        : "";

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
                    background:${tema.header};
                    padding:30px;
                    text-align:center;
                    color:white;
                ">
                    <h1 style="margin-top:0;">
                        SISPRAC
                    </h1>

                    <p style="margin-bottom:0;">
                        Revisión de informe por tutor docente
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        ${tema.titulo}
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a) <strong>${escapeHtml(nombreDestinatario)}</strong>:
                        <br/><br/>

                        Te informamos que ${sujeto}
                        ha sido ${tema.resultado}${revisor}.
                    </p>
                    ${bloqueObservacion}

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                        margin-top:25px;
                    ">
                        ${cierre}
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