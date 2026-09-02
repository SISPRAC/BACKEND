import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const asignarPlantillaPractica = async (
    plantillaEncuestaRepository,
    practicaRepository,
    practicaEncuestaRepository,
    data
) => {

    const {
        plantilla_encuesta_id,
        practicas_ids
    } = data;


    // =============================
    // VALIDAR DATOS
    // =============================

    if (
        !plantilla_encuesta_id ||
        !Array.isArray(practicas_ids)
    ) {

        throw new BadRequestError(
            "La plantilla y las prácticas son obligatorias"
        );

    }


    // =============================
    // VALIDAR PLANTILLA
    // =============================

    const plantilla =
        await plantillaEncuestaRepository.findById(
            plantilla_encuesta_id
        );

    if (!plantilla) {

        throw new NotFoundError(
            "La plantilla de encuesta no existe"
        );

    }


    // =============================
    // VALIDAR PRÁCTICAS
    // =============================

    for (const practica_id of practicas_ids) {

        const practica =
            await practicaRepository.findById(
                practica_id
            );

        if (!practica) {

            throw new NotFoundError(
                `La práctica con ID ${practica_id} no existe`
            );

        }

    }


    // =============================
    // ASIGNACIONES ACTUALES
    // =============================

    const asignacionesActuales =
        await practicaEncuestaRepository.findByPlantillaId(
            plantilla_encuesta_id
        );


    const seleccionadas =
        new Set(practicas_ids);


    const actuales =
        new Set(
            asignacionesActuales.map(
                asignacion =>
                    asignacion.practica_id
            )
        );


    // =============================
    // CREAR NUEVAS ASIGNACIONES
    // =============================

    for (const practica_id of practicas_ids) {

        if (!actuales.has(practica_id)) {

            await practicaEncuestaRepository.create({

                practica_id,

                plantilla_encuesta_id

            });

        }

    }


    // =============================
    // ELIMINAR DESMARCADAS
    // =============================

    for (const asignacion of asignacionesActuales) {

        const practica_id =
            asignacion.practica_id;


        if (!seleccionadas.has(practica_id)) {

            const respuestas =
                asignacion.respuestas || [];


            if (respuestas.length > 0) {

                throw new BadRequestError(
                    `No se puede quitar la encuesta de la práctica porque ya tiene respuestas registradas`
                );

            }


            await practicaEncuestaRepository.delete(
                asignacion.id
            );

        }

    }


    // =============================
    // RESULTADO FINAL
    // =============================

    return await practicaEncuestaRepository.findByPlantillaId(
        plantilla_encuesta_id
    );

};