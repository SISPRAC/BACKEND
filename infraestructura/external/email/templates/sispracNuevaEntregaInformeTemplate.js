const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracNuevaEntregaInformeTemplate = ({
    nombreDestinatario,
    nombrePracticante,
    nombreDocumento,
    esTutorEmpresarial
}) => {

    const documento = nombreDocumento || "documento";
    const practicante = nombrePracticante || "el practicante";

    const contenido = esTutorEmpresarial
        ? {
            titulo: "Nueva entrega pendiente de revisión",
            mensaje: `
                El practicante <strong>${escapeHtml(practicante)}</strong>
                ha realizado una nueva entrega del documento
                <strong>${escapeHtml(documento)}</strong>.
            `,
            accion: `
                Te corresponde revisar el documento y registrar
                tu aprobación u observación en SISPRAC.
            `,
            etiqueta: "PENDIENTE DE REVISIÓN",
            etiquetaColor: "#d97706",
            etiquetaFondo: "#fef3c7"
        }
        : {
            titulo: "Nueva entrega pendiente de aprobación empresarial",
            mensaje: `
                El practicante <strong>${escapeHtml(practicante)}</strong>
                ha realizado una nueva entrega del documento
                <strong>${escapeHtml(documento)}</strong>.
            `,
            accion: `
                El documento se encuentra pendiente de revisión y aprobación
                por parte del tutor empresarial. Una vez sea aprobado,
                podrás ingresar a SISPRAC para realizar tu revisión y gestión.
            `,
            etiqueta: "PENDIENTE DE APROBACIÓN EMPRESARIAL",
            etiquetaColor: "#d97706",
            etiquetaFondo: "#fef3c7"
        };

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
                        Gestión de prácticas profesionales
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="
                        color:#111827;
                        margin-top:0;
                    ">
                        ${contenido.titulo}
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a)
                        <strong>${escapeHtml(nombreDestinatario || "usuario")}</strong>:
                    </p>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                    ">
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

                        <p style="
                            color:#6b7280;
                            font-size:13px;
                            margin:0 0 8px 0;
                        ">
                            DOCUMENTO ENTREGADO
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

                    <!-- ACCIÓN -->
                    <div style="
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        border-radius:8px;
                        padding:20px;
                        margin-top:25px;
                    ">
                        <p style="
                            color:#991b1b;
                            font-weight:bold;
                            margin:0 0 8px 0;
                        ">
                            ${esTutorEmpresarial ? "Acción requerida" : "Estado del proceso"}
                        </p>

                        <p style="
                            color:#7f1d1d;
                            line-height:1.7;
                            margin:0;
                        ">
                            ${contenido.accion}
                        </p>
                    </div>

                    <p style="
                        color:#6b7280;
                        line-height:1.7;
                        font-size:14px;
                        margin-top:25px;
                    ">
                        Ingresa a SISPRAC para consultar la información
                        correspondiente a esta entrega.
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