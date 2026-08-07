import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const asignarPlantillaPeriodo = async (
    plantillaEncuestaRepository,
    periodoRepository,
    periodoPlantillaRepository,
    preguntaRepository,
    opcionPreguntaRepository,
    data
) => {

    const {
        plantilla_encuesta_id,
        periodo_id,
        version,
        preguntas
    } = data;


    // =========================
    // Validar datos obligatorios
    // =========================

    if (!plantilla_encuesta_id || !periodo_id) {

        throw new BadRequestError(
            "La plantilla y el periodo son obligatorios"
        );

    }


    // =========================
    // Buscar plantilla
    // =========================

    const plantilla =
        await plantillaEncuestaRepository.findById(
            plantilla_encuesta_id
        );


    if (!plantilla) {

        throw new NotFoundError(
            "La plantilla de encuesta no existe"
        );

    }


    // =========================
    // Buscar periodo
    // =========================

    const periodo =
        await periodoRepository.findById(
            periodo_id
        );


    if (!periodo) {

        throw new NotFoundError(
            "El periodo no existe"
        );

    }


    // =========================
    // Crear PeriodoPlantilla
    // =========================

    const periodoPlantilla =
        await periodoPlantillaRepository.create({

            plantilla_encuesta_id,

            periodo_id,

            version: version || "1.0"

        });


    // =========================
    // Crear preguntas
    // =========================

    if (preguntas?.length > 0) {

        for (const pregunta of preguntas) {

            const nuevaPregunta =
                await preguntaRepository.create({

                    periodo_plantilla_id:
                        periodoPlantilla.id,

                    texto:
                        pregunta.texto,

                    orden:
                        pregunta.orden

                });


            // =========================
            // Crear opciones
            // =========================

            if (pregunta.opciones?.length > 0) {

                for (const opcion of pregunta.opciones) {

                    await opcionPreguntaRepository.create({

                        pregunta_id:
                            nuevaPregunta.id,

                        texto:
                            opcion.texto

                    });

                }

            }

        }

    }


    // =========================
    // Retornar versión creada
    // =========================

    return await periodoPlantillaRepository.findById(
        periodoPlantilla.id
    );

};