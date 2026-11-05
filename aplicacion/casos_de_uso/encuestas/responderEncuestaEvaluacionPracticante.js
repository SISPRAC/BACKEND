
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const responderEncuestaEvaluacionPracticante = async (
    {
        plantillaEncuestaRepository,
        respuestaEncuestaRepository,
        respuestaPreguntaRepository,
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


    // Validar las respuestas recibidas
    const preguntasEncuesta = encuestaAsignada.plantilla?.preguntas || [];

    for (const respuesta of respuestas) {

        if (
            !respuesta.pregunta_id ||
            respuesta.respuesta === undefined ||
            respuesta.respuesta === null ||
            respuesta.respuesta === ""
        ) {
            throw new BadRequestError(
                "Todas las respuestas deben tener una pregunta y un valor"
            );
        }

        const preguntaPertenece = preguntasEncuesta.some(
            (pregunta) =>
                Number(pregunta.id) === Number(respuesta.pregunta_id)
        );

        if (!preguntaPertenece) {
            throw new BadRequestError(
                `La pregunta ${respuesta.pregunta_id} no pertenece a esta encuesta`
            );
        }
    }

    // Crear la respuesta general de la encuesta
    const respuestaEncuesta =
        await respuestaEncuestaRepository.create({
            usuario_id,
            practicante_id,
            practica_encuesta_id,
            fecha: new Date(),
        });

    // Guardar las respuestas individuales
    for (const respuesta of respuestas) {
        await respuestaPreguntaRepository.create({
            respuesta_encuesta_id: respuestaEncuesta.id,
            pregunta_id: respuesta.pregunta_id,
            respuesta: respuesta.respuesta,
        });
    }

    return {
        mensaje: "Encuesta respondida correctamente",
        respuestaEncuesta,
    };
};
