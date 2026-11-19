import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { validarRespuestasEncuesta } from "./validarRespuestasEncuesta.js";

import { notificarEncuestaRespondida } from "../notificarEmail/notificarEncuestaRespondida.js";

export const responderEncuestaEvaluacionPracticante = async (
    {
        plantillaEncuestaRepository,
        respuestaEncuestaRepository,
        respuestaPreguntaRepository,
        practicaPracticanteRepository,   // NUEVO
        postulacionRepository,           // NUEVO
        userRepository,                  // NUEVO
        notificacionRepository           // NUEVO
    },
    usuario_id,
    practicante_id,
    practica_encuesta_id,
    respuestas
) => {

    // Validar datos obligatorios
    if (
        !usuario_id ||
        !practicante_id ||
        !practica_encuesta_id ||
        !Array.isArray(respuestas) ||
        respuestas.length === 0
    ) {
        throw new BadRequestError(
            "Los datos de la encuesta son obligatorios"
        );
    }

    // Verificar que el practicante tenga una práctica en curso
    const practicaPracticante =
        await plantillaEncuestaRepository.findPracticaPracticanteEnCurso(
            practicante_id
        );

    if (!practicaPracticante) {
        throw new BadRequestError(
            "El practicante no tiene una práctica en curso"
        );
    }

    // Obtener las encuestas asignadas a la práctica
    const encuestas =
        await plantillaEncuestaRepository.findEncuestasByPractica(
            practicaPracticante.practica_id
        );

    // Verificar que la encuesta esté asignada a esa práctica
    const encuestaAsignada = encuestas.find(
        (encuesta) =>
            Number(encuesta.id) === Number(practica_encuesta_id)
    );

    if (!encuestaAsignada) {
        throw new BadRequestError(
            "La encuesta no está asignada a la práctica del practicante"
        );
    }

    // Verificar que la encuesta no haya sido respondida previamente
    const respuestaExistente =
        await respuestaEncuestaRepository.findByUsuarioPracticaEncuesta(
            usuario_id,
            practica_encuesta_id,
            practicante_id
        );

    if (respuestaExistente) {
        throw new BadRequestError(
            "Ya has evaluado a este practicante con esta encuesta"
        );
    }

    // Validar las respuestas según el tipo de cada pregunta
    const preguntasEncuesta = encuestaAsignada.plantilla?.preguntas || [];

    const filas = validarRespuestasEncuesta(preguntasEncuesta, respuestas);

    // Crear la respuesta general de la encuesta
    const respuestaEncuesta =
        await respuestaEncuestaRepository.create({
            usuario_id,
            practicante_id,
            practica_encuesta_id,
            fecha: new Date(),
        });

    // Guardar las respuestas individuales
    for (const fila of filas) {
        await respuestaPreguntaRepository.create({
            respuesta_encuesta_id: respuestaEncuesta.id,
            pregunta_id: fila.pregunta_id,
            respuesta: fila.respuesta,
        });
    }

    // Notificar al tutor docente (no afecta el resultado si falla)
    try {

        await notificarEncuestaRespondida({
            tipo: "EVALUACION",
            practicaPracticanteId: practicaPracticante.id,
            usuarioRespondienteId: usuario_id,
            nombreEncuesta: encuestaAsignada.plantilla?.titulo ?? "Encuesta",
            practicaPracticanteRepository,
            postulacionRepository,
            userRepository,
            notificacionRepository
        });

    } catch (errorNotificacion) {
        console.error(
            "Error notificando la evaluación del practicante:",
            errorNotificacion
        );
    }

    return {
        mensaje: "Encuesta respondida correctamente",
        respuestaEncuesta,
    };
};