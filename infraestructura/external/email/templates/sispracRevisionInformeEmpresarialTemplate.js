
const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracRevisionInformeEmpresarialTemplate = ({
    nombreDestinatario,
    nombrePracticante,
    nombreTutorEmpresarial,
    nombreDocumento,
    estado,
    observacion,
    esPracticante
}) => {

    const aprobado = estado === "APROBADO";

    const documento = nombreDocumento || "Informe";

    const tema = aprobado
        ? {
            titulo: `${escapeHtml(documento)} aprobado por el tutor empresarial`,
            cajaFondo: "#f0fdf4",
            cajaBorde: "#bbf7d0",
            cajaTitulo: "#166534",
            cajaTexto: "#14532d",
            resultado: "<strong>aprobado</strong>",
            estadoColor: "#15803d",
            estadoFondo: "#dcfce7",
            estadoTexto: "APROBADO"
        }
        : {
            titulo: `${escapeHtml(documento)} rechazado por el tutor empresarial`,
            cajaFondo: "#fef2f2",
            cajaBorde: "#fecaca",
            cajaTitulo: "#991b1b",
            cajaTexto: "#7f1d1d",
            resultado: "<strong>rechazado</strong>",
            estadoColor: "#dc2626",
            estadoFondo: "#fee2e2",
            estadoTexto: "RECHAZADO"
        };

    const sujeto = esPracticante
        ? "tu entrega"
        : `la entrega del practicante <strong>${escapeHtml(nombrePracticante)}</strong>`;

    const revisor = nombreTutorEmpresarial
        ? ` por el tutor empresarial <strong>${escapeHtml(nombreTutorEmpresarial)}</strong>`
        : " por el tutor empresarial";

    let cierre;

    if (aprobado && esPracticante) {
        cierre = "Tu documento pasa ahora a revisión del tutor docente. Te notificaremos cuando tenga una respuesta.";
    } else if (aprobado) {
        cierre = "Ya puedes ingresar a SISPRAC para revisar y gestionar este documento.";
    } else if (esPracticante) {
        cierre = "Ingresa a SISPRAC, corrige el documento según las observaciones y vuelve a realizar la entrega.";
    } else {
        cierre = "El practicante deberá corregir el documento y realizar una nueva entrega. Por ahora no se requiere ninguna acción de tu parte.";
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
                    ${aprobado ? "Observación del tutor empresarial" : "Motivo del rechazo"}
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

            <!-- HEADER: SIEMPRE ROJO -->
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
                        Revisión de documentos de prácticas profesionales
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

                    <!-- DOCUMENTO REVISADO -->
                    <div style="
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:18px 20px;
                        margin-top:25px;
                    ">
                        <p style="
                            color:#6b7280;
                            font-size:13px;
                            margin:0 0 8px 0;
                        ">
                            DOCUMENTO REVISADO
                        </p>

                        <p style="
                            color:#111827;
                            font-size:17px;
                            font-weight:bold;
                            margin:0;
                        ">
                            ${escapeHtml(documento)}
                        </p>

                        <div style="
                            display:inline-block;
                            background:${tema.estadoFondo};
                            color:${tema.estadoColor};
                            padding:6px 12px;
                            border-radius:20px;
                            font-size:12px;
                            font-weight:bold;
                            margin-top:12px;
                        ">
                            ${tema.estadoTexto}
                        </div>
                    </div>

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
                </td>
            </tr>

        </table>
    </div>
    `;
};
