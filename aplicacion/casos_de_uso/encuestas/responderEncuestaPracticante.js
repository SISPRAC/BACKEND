
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const responderEncuestaPracticante = async (
    {
        plantillaEncuestaRepository,
        respuestaEncuestaRepository,
        respuestaPreguntaRepository,
    },
    usuario_id,
    practica_encuesta_id,
    respuestas
) => {
    // 1. Validar los datos recibidos
    if (
        !usuario_id ||
        !practica_encuesta_id ||
        !Array.isArray(respuestas) ||
        respuestas.length === 0
    ) {
        throw new BadRequestError("Los datos de la encuesta son obligatorios");
    }

    // 2. Obtener el candidato y su perfil de practicante mediante el usuario autenticado
    const candidato =
        await plantillaEncuestaRepository.findPracticanteByUsuario(usuario_id);

    const practicante_id = candidato?.practicante?.id;

    if (!practicante_id) {
        throw new BadRequestError(
            "No se encontró un perfil de practicante asociado al usuario"
        );
    }

    // 3. Verificar que el practicante tenga una práctica en curso
    const practicaPracticante =
        await plantillaEncuestaRepository.findPracticaPracticanteEnCurso(
            practicante_id
        );

    if (!practicaPracticante) {
        throw new BadRequestError(
            "No tienes una práctica en curso para responder esta encuesta"
        );
    }

    // 4. Obtener las encuestas asignadas a la práctica
    const encuestas =
        await plantillaEncuestaRepository.findEncuestasByPractica(
            practicaPracticante.practica_id
        );

    // 5. Verificar que la encuesta pertenezca a la práctica actual
    const encuestaAsignada = encuestas.find(
        (encuesta) =>
            Number(encuesta.id) === Number(practica_encuesta_id)
    );

    if (!encuestaAsignada) {
        throw new BadRequestError(
            "La encuesta no está asignada a tu práctica actual"
        );
    }

    // 6. Verificar que el usuario no haya respondido ya esta encuesta
    const respuestaExistente =
        await respuestaEncuestaRepository.findByUsuarioPracticaEncuesta(
            usuario_id,
            practica_encuesta_id,
            practicante_id
        );

    if (respuestaExistente) {
        throw new BadRequestError(
            "Ya has respondido esta encuesta para tu práctica actual"
        );
    }

    // 7. Validar que todas las preguntas pertenezcan a la encuesta asignada
    const preguntasEncuesta =
        encuestaAsignada.plantilla?.preguntas || [];

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

    // 8. Crear el registro principal de la respuesta
    const respuestaEncuesta = await respuestaEncuestaRepository.create({
        usuario_id,
        practicante_id,
        practica_encuesta_id,
        fecha: new Date(),
    });

    // 9. Guardar las respuestas individuales
    for (const respuesta of respuestas) {
        await respuestaPreguntaRepository.create({
            respuesta_encuesta_id: respuestaEncuesta.id,
            pregunta_id: respuesta.pregunta_id,
            respuesta: respuesta.respuesta,
        });
    }

    // 10. Retornar el resultado
    return {
        mensaje: "Encuesta respondida correctamente",
        respuestaEncuesta,
    };
};
