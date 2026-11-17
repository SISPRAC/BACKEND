import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracDocumentoRequisitoSubidoTemplate } from "../../../infraestructura/external/email/templates/sispracDocumentoRequisitoSubidoTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

// YYYY-MM-DD -> DD/MM/YYYY
const formatearFecha = (fecha) => {
    if (!fecha) return null;
    const [y, m, d] = String(fecha).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
};

export const notificarPracticaRequisitoDocumentoSubido = async ({
    documento,
    practicaRequisitoDocumentoSubidoRepository,
    notificacionRepository,
    esActualizacion = false          // <-- NUEVO
}) => {

    // ==========================================
    // EXTRAER DATOS
    // ==========================================

    const practicaRequisitoDocumento = documento?.practicaRequisitoDocumento;
    const practicaId = practicaRequisitoDocumento?.practica_id;

    const usuarioPracticante = documento?.usuario ?? null;
    const candidato = usuarioPracticante?.Candidato ?? null;

    const nombreDocumento =
        practicaRequisitoDocumento?.tipoRequisitoDocumento?.nombre ||
        "documento";

    const nombrePracticante =
        obtenerNombre(usuarioPracticante) || "el practicante";

    const fechaVencimiento = formatearFecha(documento?.fecha_vencimiento);

    // Grupo correspondiente a la práctica
    const grupo =
        candidato?.gruposAsignados
            ?.map((ga) => ga.grupo)
            .find(
                (g) => Number(g?.practica_id) === Number(practicaId)
            ) ?? null;

    // Tutor docente (único destinatario): segunda consulta
    const tutorDocente = grupo?.tutorDocente_id
        ? await practicaRequisitoDocumentoSubidoRepository
            .findTutorDocenteConUsuario(grupo.tutorDocente_id)
        : null;

    const usuarioTutorDocente = tutorDocente?.Usuario ?? null;

    console.log("[documentoRequisitoSubido] Tutor:", {
        id: usuarioTutorDocente?.id,
        nombre: obtenerNombre(usuarioTutorDocente),
        correo: usuarioTutorDocente?.correo
    });

    if (!usuarioTutorDocente?.id) {
        console.warn(
            "[documentoRequisitoSubido] No se encontró tutor docente."
        );
        return;
    }

    // ==========================================
    // CREAR NOTIFICACIÓN Y ENVIAR CORREO
    // ==========================================
    const titulo = esActualizacion
        ? "Documento actualizado pendiente de revisión"
        : "Nuevo documento pendiente de revisión";

    const descripcion = esActualizacion
        ? `${nombrePracticante} actualizó el documento "${nombreDocumento}". ` +
        "Debes revisar la nueva versión y registrar su aprobación u observación en SISPRAC."
        : `${nombrePracticante} subió el documento "${nombreDocumento}". ` +
        "Debes revisarlo y registrar su aprobación u observación en SISPRAC.";

    const tareas = [
        {
            tipo: "notificación interna",
            promise: crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuarioTutorDocente.id,
                    titulo,
                    descripcion
                }
            )
        }
    ];

    if (usuarioTutorDocente.correo) {

        tareas.push({
            tipo: "correo electrónico",
            promise: sendEmail({
                to: usuarioTutorDocente.correo,
                subject: `${titulo} - ${nombreDocumento}`,
                html: sispracDocumentoRequisitoSubidoTemplate({
                    nombreDestinatario: obtenerNombre(usuarioTutorDocente),
                    nombrePracticante,
                    nombreDocumento,
                    fechaVencimiento,
                    esActualizacion                  // <-- NUEVO
                })
            })
        });

    } else {
        console.warn(
            `[documentoRequisitoSubido] El usuario ${usuarioTutorDocente.id} no tiene correo registrado.`
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