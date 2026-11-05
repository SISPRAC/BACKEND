
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerEncuestasPracticante = async (
    { plantillaEncuestaRepository, respuestaEncuestaRepository },
    user_id
) => {

    // Validar datos
    if (!user_id) {
        throw new BadRequestError(
            "El usuario es obligatorio"
        );
    }

    // Obtener el candidato asociado al usuario
    const candidato =
        await plantillaEncuestaRepository.findPracticanteByUsuario(
            user_id
        );

    if (!candidato?.practicante) {
        return [];
    }

    const practicante_id = candidato.practicante.id;

    // Obtener la práctica en curso del practicante
    const practicaPracticante =
        await plantillaEncuestaRepository.findPracticaPracticanteEnCurso(
            practicante_id
        );

    if (!practicaPracticante) {
        return [];
    }

    // Obtener las encuestas asignadas a la práctica
    const encuestas =
        await plantillaEncuestaRepository.findEncuestasByPractica(
            practicaPracticante.practica_id
        );

    // Filtrar las encuestas correspondientes al rol Practicante
    const encuestasPracticante = encuestas.filter(
        (encuesta) =>
            encuesta.plantilla?.Role?.nombre === "Practicante"
    );

    // Obtener las respuestas registradas del practicante
    const respuestasEncuestas =
        await respuestaEncuestaRepository.findByPracticante(
            practicante_id
        );
 
    // Indicar cuáles encuestas ya fueron respondidas
    return encuestasPracticante.map((encuesta) => {

        const encuestaData = encuesta.toJSON();

        const respondida = respuestasEncuestas.some(
            (respuesta) =>
                Number(respuesta.practica_encuesta_id) ===
                Number(encuesta.id)
        );

        return {
            ...encuestaData,
            respondida,
        };

    });

};
