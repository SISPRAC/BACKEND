import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRevisionInformeTemplate } from "../../../infraestructura/external/email/templates/sispracRevisionInformeTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarRevisionInformeTutorDocente = async ({
    entrega,
    nombreTutorDocente,
    estado,
    observacion,
    notificacionRepository
}) => {

    const aprobado = estado === "APROBADO";

    // ==========================================
    // EXTRAER DATOS DE LA ENTREGA
    // ==========================================

    const practicaPracticante = entrega?.practicaPracticante;
    const candidato = practicaPracticante?.practicante?.candidato;

    const usuarioPracticante = candidato?.Usuario ?? null;

    // Sequelize pluraliza el nombre del modelo cuando no hay alias.
    const postulaciones =
        candidato?.Postulacions ?? candidato?.Postulaciones ?? [];

    // Postulación aceptada, de la misma práctica de la entrega.
    const postulacionAceptada =
        postulaciones.find(
            (p) =>
                p?.estado === "ACEPTADO" &&
                p?.AperturaVacante?.practica_id === practicaPracticante?.practica_id
        ) ?? null;

    const usuarioTutorEmpresarial =
        postulacionAceptada?.AperturaVacante?.TutorEmpresa?.Usuario ?? null;

    const nombrePracticante =
        obtenerNombre(usuarioPracticante) || "el practicante";

    // Solo estos dos destinatarios.
    const destinatarios = [
        { usuario: usuarioTutorEmpresarial, esPracticante: false },
        { usuario: usuarioPracticante, esPracticante: true }
    ].filter((d) => d.usuario);

    console.log("[revisionInforme] Datos:", {
        candidato: !!candidato,
        postulaciones: postulaciones.length,
        postulacionAceptada: !!postulacionAceptada,
        tutorEmpresarial: !!usuarioTutorEmpresarial,
        practicante: !!usuarioPracticante
    });

    if (destinatarios.length === 0) {
        console.warn(
            "[revisionInforme] No se encontraron destinatarios. Revisa las asociaciones en findByIdParaNotificacion."
        );
        return;
    }

    const titulo = aprobado ? "Informe aprobado" : "Informe rechazado";

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const notificaciones = destinatarios
        .filter(({ usuario }) => usuario.id)
        .map(({ usuario, esPracticante }) => {

            const sujeto = esPracticante
                ? "Tu entrega del informe"
                : `La entrega del informe de ${nombrePracticante}`;

            const descripcion = aprobado
                ? `${sujeto} fue aprobada por el tutor docente.`
                : `${sujeto} fue rechazada por el tutor docente. Motivo: ${observacion || "No especificado"}.`;

            return crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                }
            );
        });

    const resultadosNotificaciones = await Promise.allSettled(
        notificaciones
    );

    resultadosNotificaciones.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de revisión de informe:",
                resultado.reason
            );
        }

    });

    // ==========================================
    // NOTIFICACIONES POR CORREO
    // ==========================================

    const envios = destinatarios
        .filter(({ usuario }) => usuario.correo)
        .map(({ usuario, esPracticante }) => {

            const html = sispracRevisionInformeTemplate({
                nombreDestinatario: obtenerNombre(usuario),
                nombrePracticante,
                nombreTutorDocente,
                estado,
                observacion,
                esPracticante
            });

            return sendEmail({
                to: usuario.correo,
                subject: titulo,
                html
            });
        });

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error enviando correo de revisión de informe:",
                resultado.reason
            );
        }

    });

};