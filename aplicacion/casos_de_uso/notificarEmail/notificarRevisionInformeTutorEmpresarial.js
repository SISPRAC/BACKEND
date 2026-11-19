
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRevisionInformeEmpresarialTemplate } from "../../../infraestructura/external/email/templates/sispracRevisionInformeEmpresarialTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarRevisionInformeTutorEmpresarial = async ({
    entrega,
    nombreDocumento,
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

    const postulaciones =
        candidato?.Postulacions ?? candidato?.Postulaciones ?? [];

    const postulacionAceptada =
        postulaciones.find(
            (p) =>
                p?.estado === "ACEPTADO" &&
                p?.AperturaVacante?.practica_id === practicaPracticante?.practica_id
        ) ?? null;

    const usuarioTutorEmpresarial =
        postulacionAceptada?.AperturaVacante?.TutorEmpresa?.Usuario ?? null;

    const grupo =
        candidato?.gruposAsignados
            ?.map((ga) => ga.grupo)
            .find((g) => g?.practica_id === practicaPracticante?.practica_id)
        ?? null;

    const usuarioTutorDocente = grupo?.TutorDocente?.Usuario ?? null;

    const nombrePracticante =
        obtenerNombre(usuarioPracticante) || "el practicante";

    const nombreTutorEmpresarial =
        obtenerNombre(usuarioTutorEmpresarial);

    const documento =
        nombreDocumento || "el informe";

    // Solo estos dos destinatarios.
    const destinatarios = [
        { usuario: usuarioTutorDocente, esPracticante: false },
        { usuario: usuarioPracticante, esPracticante: true }
    ].filter((d) => d.usuario);

    console.log("[revisionInformeEmpresarial] Datos:", {
        candidato: !!candidato,
        postulaciones: postulaciones.length,
        postulacionAceptada: !!postulacionAceptada,
        tutorEmpresarial: !!usuarioTutorEmpresarial,
        tutorDocente: !!usuarioTutorDocente,
        practicante: !!usuarioPracticante,
        nombreDocumento: documento
    });

    if (destinatarios.length === 0) {
        console.warn(
            "[revisionInformeEmpresarial] No se encontraron destinatarios. Revisa las asociaciones en findByIdParaNotificacion."
        );
        return;
    }

    const titulo = aprobado
        ? `${documento} aprobado por el tutor empresarial`
        : `${documento} rechazado por el tutor empresarial`;

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const notificaciones = destinatarios
        .filter(({ usuario }) => usuario.id)
        .map(({ usuario, esPracticante }) => {

            let descripcion;

            if (aprobado && esPracticante) {
                descripcion = `Tu documento "${documento}" fue aprobado por el tutor empresarial y ahora pasa a revisión del tutor docente.`;
            } else if (aprobado) {
                descripcion = `El tutor empresarial aprobó el documento "${documento}" de ${nombrePracticante}. Ya puedes revisarlo y gestionarlo.`;
            } else if (esPracticante) {
                descripcion = `Tu documento "${documento}" fue rechazado por el tutor empresarial. Motivo: ${observacion || "No especificado"}.`;
            } else {
                descripcion = `El tutor empresarial rechazó el documento "${documento}" de ${nombrePracticante}. Motivo: ${observacion || "No especificado"}.`;
            }

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
                "Error creando notificación interna de revisión de informe (empresarial):",
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

            const html = sispracRevisionInformeEmpresarialTemplate({
                nombreDestinatario: obtenerNombre(usuario),
                nombrePracticante,
                nombreTutorEmpresarial,
                nombreDocumento: documento,
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
                "Error enviando correo de revisión de informe (empresarial):",
                resultado.reason
            );
        }

    });

};
