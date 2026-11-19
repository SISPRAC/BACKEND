import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracEncuestaRespondidaTemplate } from "../../../infraestructura/external/email/templates/sispracEncuestaRespondidaTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

export const notificarEncuestaRespondida = async ({
    tipo,                         // "PRACTICANTE" | "EVALUACION"
    practicaPracticanteId,
    usuarioRespondienteId,        // quien respondió
    nombreEncuesta,
    practicaPracticanteRepository,
    postulacionRepository,
    userRepository,
    notificacionRepository
}) => {

    const esEvaluacion = tipo === "EVALUACION";

    // ==========================================
    // PRACTICANTE
    // ==========================================

    const practicaPracticante =
        await practicaPracticanteRepository
            .findByIdWithPracticaAndCandidato(practicaPracticanteId);

    const candidato = practicaPracticante?.practicante?.candidato;
    const usuarioPracticante = candidato?.Usuario ?? null;

    if (!candidato) {
        console.warn("[encuestaRespondida] No se encontró el practicante.");
        return;
    }

    const nombrePracticante =
        obtenerNombre(usuarioPracticante) || "el practicante";

    // ==========================================
    // TUTOR DOCENTE (único destinatario)
    // ==========================================

    const grupo =
        await practicaPracticanteRepository
            .findGrupoConTutorByPracticaAndCandidato(
                practicaPracticante.practica_id,
                candidato.id
            );

    const usuarioTutorDocente = grupo?.TutorDocente?.Usuario ?? null;

    if (!usuarioTutorDocente?.id) {
        console.warn("[encuestaRespondida] No se encontró el tutor docente.");
        return;
    }

    // Si quien respondió es el propio tutor docente, no se notifica a sí mismo
    if (Number(usuarioTutorDocente.id) === Number(usuarioRespondienteId)) {
        return;
    }

    // ==========================================
    // QUIÉN RESPONDIÓ (solo en EVALUACION)
    // ==========================================

    let rolRespondiente = null;
    let nombreRespondiente = null;
    let nombreEmpresa = null;

    if (esEvaluacion) {

        const usuarioRespondiente =
            await userRepository.findById(usuarioRespondienteId);

        nombreRespondiente = obtenerNombre(usuarioRespondiente) || null;

        const postulacion =
            await postulacionRepository.findAceptadaByCandidatoYPractica(
                candidato.id,
                practicaPracticante.practica_id
            );

        const tutorEmpresarial = postulacion?.AperturaVacante?.TutorEmpresa;

        nombreEmpresa = tutorEmpresarial?.Empresa?.nombre ?? null;

        const esTutorEmpresarial =
            Number(tutorEmpresarial?.Usuario?.id) ===
            Number(usuarioRespondienteId);

        rolRespondiente = esTutorEmpresarial
            ? "El tutor empresarial"
            : "El evaluador";
    }

    // ==========================================
    // TEXTOS
    // ==========================================

    const titulo = esEvaluacion
        ? "Evaluación del practicante respondida"
        : "Encuesta respondida por el practicante";

    const quien = esEvaluacion
        ? `${rolRespondiente}${nombreRespondiente ? ` ${nombreRespondiente}` : ""}${nombreEmpresa ? ` de la empresa ${nombreEmpresa}` : ""}`
        : `El practicante ${nombrePracticante}`;

    const descripcion = esEvaluacion
        ? `${quien} respondió la encuesta "${nombreEncuesta}" con la evaluación del practicante ${nombrePracticante}.`
        : `${quien} respondió la encuesta "${nombreEncuesta}" sobre su práctica.`;

    // ==========================================
    // NOTIFICACIÓN INTERNA Y CORREO
    // ==========================================

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
                subject: `${titulo} - ${nombrePracticante}`,
                html: sispracEncuestaRespondidaTemplate({
                    esEvaluacion,
                    nombreDestinatario: obtenerNombre(usuarioTutorDocente),
                    nombrePracticante,
                    rolRespondiente,
                    nombreRespondiente,
                    nombreEmpresa,
                    nombreEncuesta
                })
            })
        });

    } else {
        console.warn(
            `[encuestaRespondida] El usuario ${usuarioTutorDocente.id} no tiene correo registrado.`
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