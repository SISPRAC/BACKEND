const escapeHtml = (text = "") =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export const sispracDocumentoEmpresaTemplate = ({
    nombreDirector,
    nombreEmpresa,
    nombreDocumento,
    nombreArchivo,
    fechaSubida
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
                        Documento pendiente de revisión
                    </p>
                </td>
            </tr>

            <!-- BODY -->
            <tr>
                <td style="padding:40px;">

                    <h2 style="color:#111827;">
                        Nuevo documento de convenio
                    </h2>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:16px;
                    ">
                        Estimado(a) <strong>${escapeHtml(nombreDirector)}</strong>:
                        <br/><br/>

                        La empresa
                        <strong>${escapeHtml(nombreEmpresa)}</strong>
                        ha cargado un documento que requiere tu revisión.
                    </p>

                    <!-- DETALLE -->
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
                            Detalle del documento
                        </h3>

                        <p style="
                            color:#1e3a8a;
                            line-height:1.7;
                            margin-bottom:0;
                        ">
                            <strong>Requisito:</strong> ${escapeHtml(nombreDocumento)}
                            <br/>
                            <strong>Archivo:</strong> ${escapeHtml(nombreArchivo)}
                            <br/>
                            <strong>Fecha de carga:</strong> ${escapeHtml(fechaSubida)}
                        </p>

                    </div>

                    <p style="
                        color:#4b5563;
                        line-height:1.7;
                        font-size:15px;
                        margin-top:25px;
                    ">
                        Ingresa a SISPRAC para revisar el documento y
                        aprobarlo o rechazarlo según corresponda.
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