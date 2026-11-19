import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracNuevaEntregaInformeTemplate } from "../../../infraestructura/external/email/templates/sispracNuevaEntregaInformeTemplate.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarNuevaEntregaInforme = async ({
    entrega,
    notificacionRepository
}) => {

    // ==========================================
    // EXTRAER DATOS DE LA ENTREGA
    // ==========================================

    const practicaPracticante = entrega?.practicaPracticante;
    const candidato = practicaPracticante?.practicante?.candidato;

    const usuarioPracticante = candidato?.Usuario ?? null;

    const postulaciones =
        candidato?.Postulacions ?? candidato?.Postulaciones ?? [];

    // Postulación aceptada de la misma práctica
    const postulacionAceptada =
        postulaciones.find(
            (p) =>
                p?.estado === "ACEPTADO" &&
                p?.AperturaVacante?.practica_id ===
                    practicaPracticante?.practica_id
        ) ?? null;

    // Tutor empresarial
    const usuarioTutorEmpresarial =
        postulacionAceptada
            ?.AperturaVacante
            ?.TutorEmpresa
            ?.Usuario ?? null;

    // Grupo correspondiente a la práctica
    const grupo =
        candidato?.gruposAsignados
            ?.map((ga) => ga.grupo)
            .find(
                (g) =>
                    g?.practica_id === practicaPracticante?.practica_id
            ) ?? null;

    // Tutor docente
    const usuarioTutorDocente =
        grupo?.TutorDocente?.Usuario ?? null;

    // Nombre del documento entregado
    const nombreDocumento =
        entrega?.practicaRequisitoDocumento
            ?.tipoRequisitoDocumento
            ?.nombre || "documento";

    const nombrePracticante =
        obtenerNombre(usuarioPracticante) || "el practicante";

    // ==========================================
    // DESTINATARIOS
    // ==========================================

    const destinatarios = [
        {
            usuario: usuarioTutorEmpresarial,
            tipo: "EMPRESARIAL"
        },
        {
            usuario: usuarioTutorDocente,
            tipo: "DOCENTE"
        }
    ].filter((d) => d.usuario?.id);

    console.log("[nuevaEntregaInforme] Datos:", {
        nombreDocumento,
        practicante: !!usuarioPracticante,
        tutorEmpresarial: !!usuarioTutorEmpresarial,
        tutorDocente: !!usuarioTutorDocente
    });

    if (destinatarios.length === 0) {
        console.warn(
            "[nuevaEntregaInforme] No se encontraron destinatarios."
        );
        return;
    }

    // ==========================================
    // CREAR NOTIFICACIONES Y ENVIAR CORREOS
    // ==========================================

    const tareas = destinatarios.flatMap(({ usuario, tipo }) => {

        const esTutorEmpresarial = tipo === "EMPRESARIAL";

        const titulo = esTutorEmpresarial
            ? "Nueva entrega pendiente de revisión"
            : "Nueva entrega pendiente de aprobación empresarial";

        const descripcion = esTutorEmpresarial
            ? `${nombrePracticante} realizó una nueva entrega del documento "${nombreDocumento}". ` +
              "Debes revisar el documento y registrar tu aprobación u observación en SISPRAC."
            : `${nombrePracticante} realizó una nueva entrega del documento "${nombreDocumento}". ` +
              "El documento está pendiente de revisión y aprobación por parte del tutor empresarial. ";

        const asunto = esTutorEmpresarial
            ? `Nueva entrega pendiente de revisión - ${nombreDocumento}`
            : `Nueva entrega pendiente de aprobación empresarial - ${nombreDocumento}`;

        const tareasDestinatario = [];

        // Crear notificación interna
        tareasDestinatario.push({
            tipo: `notificación interna (${tipo})`,
            promise: crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                }
            )
        });

        // Enviar correo si el usuario tiene correo registrado
        if (usuario.correo) {

            const html = sispracNuevaEntregaInformeTemplate({
                nombreDestinatario: obtenerNombre(usuario),
                nombrePracticante,
                nombreDocumento,
                esTutorEmpresarial
            });

            tareasDestinatario.push({
                tipo: `correo electrónico (${tipo})`,
                promise: sendEmail({
                    to: usuario.correo,
                    subject: asunto,
                    html
                })
            });

        } else {
            console.warn(
                `[nuevaEntregaInforme] El usuario ${usuario.id} no tiene correo registrado.`
            );
        }

        return tareasDestinatario;
    });

    // ==========================================
    // EJECUTAR Y CONTROLAR RESULTADOS
    // ==========================================

    const resultados = await Promise.allSettled(
        tareas.map((tarea) => tarea.promise)
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