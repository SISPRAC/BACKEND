const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracDocumentoRequisitoSubidoTemplate = ({
    nombreDestinatario,
    nombrePracticante,
    nombreDocumento,
    fechaVencimiento,
    esActualizacion = false
}) => {

    const documento = nombreDocumento || "documento";
    const practicante = nombrePracticante || "el practicante";

    const titulo = esActualizacion
        ? "Documento actualizado pendiente de revisión"
        : "Nuevo documento pendiente de revisión";

    const verbo = esActualizacion ? "ha actualizado" : "ha subido";
    const etiquetaDocumento = esActualizacion ? "DOCUMENTO ACTUALIZADO" : "DOCUMENTO SUBIDO";

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
                        ${titulo}
                    </h2>

                    <p style="color:#4b5563;line-height:1.7;font-size:16px;">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                    <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                        El practicante <strong>${escapeHtml(practicante)}</strong>
                        ${verbo} el documento
                        <strong>${escapeHtml(documento)}</strong>.
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
                            ${etiquetaDocumento}
                        </p>

                        <p style="color:#111827;font-size:17px;font-weight:bold;margin:0;">
                            ${escapeHtml(documento)}
                        </p>

                        ${fechaVencimiento
            ? `<p style="color:#6b7280;font-size:14px;margin:10px 0 0 0;">
                                       Fecha de vencimiento:
                                       <strong>${escapeHtml(fechaVencimiento)}</strong>
                                   </p>`
            : ""
        }

                        <div style="
                            display:inline-block;
                            background:#fef3c7;
                            color:#d97706;
                            padding:6px 12px;
                            border-radius:20px;
                            font-size:12px;
                            font-weight:bold;
                            margin-top:12px;
                        ">
                            PENDIENTE DE REVISIÓN
                        </div>
                    </div>

                    <!-- ACCIÓN -->
                    <div style="
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">
                        <p style="color:#991b1b;font-weight:bold;margin:0 0 8px 0;">
                            Acción requerida
                        </p>

                        <p style="color:#7f1d1d;line-height:1.7;margin:0;">
                            Te corresponde revisar el documento y registrar
                            tu aprobación u observación en SISPRAC.
                        </p>
                    </div>

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