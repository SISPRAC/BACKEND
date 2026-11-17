const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracRevisionDocumentoRequisitoTemplate = ({
    nombreDestinatario,
    nombreDocumento,
    aprobado,
    observacion
}) => {

    const documento = nombreDocumento || "documento";

    const contenido = aprobado
        ? {
            titulo: "Documento aprobado",
            mensaje: "Tu documento fue revisado y aprobado.",
            etiqueta: "APROBADO",
            etiquetaColor: "#15803d",
            etiquetaFondo: "#dcfce7"
        }
        : {
            titulo: "Documento rechazado",
            mensaje: "Tu documento fue revisado y rechazado.",
            etiqueta: "RECHAZADO",
            etiquetaColor: "#b91c1c",
            etiquetaFondo: "#fee2e2"
        };

    const bloqueObservacion = !aprobado
        ? `
        <div style="
            background:#fef2f2;
            border:1px solid #fecaca;
            border-radius:8px;
            padding:20px;
            margin-top:25px;
        ">
            <p style="color:#991b1b;font-weight:bold;margin:0 0 8px 0;">
                Observación del revisor
            </p>
            <p style="color:#7f1d1d;line-height:1.7;margin:0;">
                ${escapeHtml(observacion || "Sin observación.")}
            </p>
            <p style="color:#7f1d1d;line-height:1.7;margin:12px 0 0 0;">
                Debes corregir el documento y volver a subirlo en SISPRAC.
            </p>
        </div>`
        : "";

    return `
    <div style="background-color:#f4f6f9;padding:40px 0;font-family:Arial,sans-serif;">

        <table align="center" width="600" cellpadding="0" cellspacing="0" style="
            background:white;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">

            <!-- HEADER -->
            <tr>
                <td style="background:#dc2626;padding:30px;text-align:center;color:white;">
                    <h1 style="margin-top:0;">SISPRAC</h1>
                    <p style="margin-bottom:0;">Gestión de prácticas profesionales</p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;margin-top:0;">
                        ${contenido.titulo}
                    </h2>

                    <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                    <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                        ${contenido.mensaje}
                    </p>

                    <!-- DOCUMENTO -->
                    <div style="
                        background:#f9fafb;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:18px 20px;
                        margin-top:25px;
                    ">
                        <p style="color:#6b7280;font-size:13px;margin:0 0 8px 0;">
                            DOCUMENTO REVISADO
                        </p>

                        <p style="color:#111827;font-size:17px;font-weight:bold;margin:0;">
                            ${escapeHtml(documento)}
                        </p>

                        <div style="
                            display:inline-block;
                            background:${contenido.etiquetaFondo};
                            color:${contenido.etiquetaColor};
                            padding:6px 12px;
                            border-radius:20px;
                            font-size:12px;
                            font-weight:bold;
                            margin-top:12px;
                        ">
                            ${contenido.etiqueta}
                        </div>
                    </div>

                    ${bloqueObservacion}

                    <p style="color:#6b7280;line-height:1.7;font-size:14px;margin-top:25px;">
                        Ingresa a SISPRAC para consultar la información
                        correspondiente a este documento.
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