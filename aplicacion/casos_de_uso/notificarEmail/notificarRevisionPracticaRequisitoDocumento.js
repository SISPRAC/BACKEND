import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRevisionDocumentoRequisitoTemplate } from "../../../infraestructura/external/email/templates/sispracRevisionDocumentoRequisitoTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

export const notificarRevisionPracticaRequisitoDocumento = async ({
    documento,
    notificacionRepository,
    aprobado
}) => {

    // ==========================================
    // EXTRAER DATOS
    // ==========================================

    const usuarioPracticante = documento?.usuario ?? null;

    if (!usuarioPracticante?.id) {
        console.warn(
            "[revisionDocumentoRequisito] No se encontró el practicante."
        );
        return;
    }

    const nombreDocumento =
        documento?.practicaRequisitoDocumento
            ?.tipoRequisitoDocumento
            ?.nombre || "documento";

    const observacion = documento?.observacion?.trim() || null;

    // ==========================================
    // TEXTOS
    // ==========================================

    const titulo = aprobado
        ? "Documento aprobado"
        : "Documento rechazado";

    const descripcion = aprobado
        ? `Tu documento "${nombreDocumento}" fue aprobado.`
        : `Tu documento "${nombreDocumento}" fue rechazado.` +
          (observacion ? ` Observación: ${observacion}` : "") +
          " Debes corregirlo y volver a subirlo en SISPRAC.";

    // ==========================================
    // CREAR NOTIFICACIÓN Y ENVIAR CORREO
    // ==========================================

    const tareas = [
        {
            tipo: "notificación interna",
            promise: crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuarioPracticante.id,
                    titulo,
                    descripcion
                }
            )
        }
    ];

    if (usuarioPracticante.correo) {

        tareas.push({
            tipo: "correo electrónico",
            promise: sendEmail({
                to: usuarioPracticante.correo,
                subject: `${titulo} - ${nombreDocumento}`,
                html: sispracRevisionDocumentoRequisitoTemplate({
                    nombreDestinatario: obtenerNombre(usuarioPracticante),
                    nombreDocumento,
                    aprobado,
                    observacion
                })
            })
        });

    } else {
        console.warn(
            `[revisionDocumentoRequisito] El usuario ${usuarioPracticante.id} no tiene correo registrado.`
        );
    }

    const resultados = await Promise.allSettled(
        tareas.map((t) => t.promise)
    );

    resultados.forEach((resultado, index) => {
        if (resultado.status === "rejected") {
            console.error(
                `Error en ${tareas[index].tipo}:`,
                resultado.reason
            );
        }
    });
};