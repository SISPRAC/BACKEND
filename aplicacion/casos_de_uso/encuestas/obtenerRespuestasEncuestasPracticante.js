
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerRespuestasEncuestasPracticante = async (
    {
        plantillaEncuestaRepository,
        respuestaEncuestaRepository,
    },
    practicante_id
) => {
    if (!practicante_id) {
        throw new BadRequestError(
            "El identificador del practicante es obligatorio"
        );
    }

    // Obtener las prácticas en curso y finalizadas del practicante
    const practicas =
        await plantillaEncuestaRepository.findPracticasPracticanteParaEncuestas(
            practicante_id
        );

    if (!practicas || practicas.length === 0) {
        return [];
    }

    // Consultar las encuestas de todas las prácticas
    const resultado = await Promise.all(
        practicas.map(async (practicaPracticante) => {
            const encuestas =
                await plantillaEncuestaRepository.findEncuestasByPractica(
                    practicaPracticante.practica_id
                );

            // Solo las encuestas correspondientes al rol Practicante
            const encuestasConRespuestas = await Promise.all(
                encuestas.map(async (encuesta) => {

                    const respuestaEncuesta =
                        await respuestaEncuestaRepository.findDetalleByPracticanteYEncuesta(
                            practicante_id,
                            encuesta.id
                        );

                    const encuestaData = encuesta.toJSON();


                    if (!respuestaEncuesta) {
                        return {
                            ...encuestaData,
                            respondida: false,
                            respuestas: [],
                        };
                    }

                    const respuestaData = respuestaEncuesta.toJSON();
             

                    return {
                        ...encuestaData,
                        respondida: true,
                        fechaRespuesta: respuestaData.fecha,
                        respuestas: (
                            respuestaData.RespuestaPregunta || []
                        ).map((respuesta) => ({
                            pregunta_id: respuesta.pregunta_id,
                            textoPregunta: respuesta.Preguntum?.texto,
                            respuesta: respuesta.respuesta,
                        })),
                    };
                })
            );

            return {
                practica_practicante_id: practicaPracticante.id,
                practica_id: practicaPracticante.practica_id,
                estadoPractica: practicaPracticante.estado,
                encuestas: encuestasConRespuestas,
            };
        })
    );

    return resultado;
};
