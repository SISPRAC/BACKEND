import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const actualizarPeriodoPlantilla = async (
    periodoPlantillaRepository,
    preguntaRepository,
    opcionPreguntaRepository,
    respuestaPreguntaRepository,
    id,
    data
) => {

    // =========================
    // Buscar PeriodoPlantilla
    // =========================

    const periodoPlantilla =
        await periodoPlantillaRepository.findById(id);


    if (!periodoPlantilla) {

        throw new NotFoundError(
            "La versión de la encuesta no existe"
        );

    }


    // =========================
    // Actualizar versión
    // =========================

    if (data.version) {

        await periodoPlantillaRepository.update(

            id,

            {
                version: data.version
            }

        );

    }


    // =========================
    // Actualizar preguntas
    // =========================

    if (data.preguntas) {


        const preguntasActuales =
            periodoPlantilla.preguntas || [];


        // =========================
        // Eliminar preguntas borradas
        // =========================

        for (const preguntaActual of preguntasActuales) {


            const existe =
                data.preguntas.some(

                    p => p.id === preguntaActual.id

                );


            if (!existe) {


                const respuestas =
                    await respuestaPreguntaRepository.countByPregunta(
                        preguntaActual.id
                    );


                // Solo eliminar si no tiene respuestas

                if (respuestas === 0) {

                    await preguntaRepository.delete(
                        preguntaActual.id
                    );

                }

            }

        }


        // =========================
        // Crear / actualizar preguntas
        // =========================

        for (const pregunta of data.preguntas) {


            // =========================
            // Pregunta existente
            // =========================

            if (pregunta.id) {


                const respuestas =
                    await respuestaPreguntaRepository.countByPregunta(
                        pregunta.id
                    );


                // Solo modificar si no tiene respuestas

                if (respuestas === 0) {


                    await preguntaRepository.update(

                        pregunta.id,

                        {
                            texto: pregunta.texto,
                            orden: pregunta.orden
                        }

                    );


                    // =========================
                    // Buscar pregunta actualizada
                    // =========================

                    const preguntaBD =
                        await preguntaRepository.findById(
                            pregunta.id
                        );


                    const opcionesActuales =
                        preguntaBD.OpcionesPregunta || [];


                    // =========================
                    // Eliminar opciones quitadas
                    // =========================

                    for (
                        const opcionActual
                        of opcionesActuales
                    ) {


                        const existeOpcion =
                            pregunta.opciones.some(

                                o => o.id === opcionActual.id

                            );


                        if (!existeOpcion) {


                            await opcionPreguntaRepository.delete(

                                opcionActual.id

                            );

                        }

                    }


                    // =========================
                    // Crear / actualizar opciones
                    // =========================

                    for (
                        const opcion
                        of pregunta.opciones
                    ) {


                        if (opcion.id) {


                            await opcionPreguntaRepository.update(

                                opcion.id,

                                {
                                    texto: opcion.texto
                                }

                            );


                        } else {


                            await opcionPreguntaRepository.create({

                                pregunta_id:
                                    pregunta.id,

                                texto:
                                    opcion.texto

                            });

                        }

                    }

                }


            } else {


                // =========================
                // Pregunta nueva
                // =========================

                const nuevaPregunta =
                    await preguntaRepository.create({

                        periodo_plantilla_id:
                            id,

                        texto:
                            pregunta.texto,

                        orden:
                            pregunta.orden

                    });


                // =========================
                // Crear opciones
                // =========================

                for (
                    const opcion
                    of pregunta.opciones
                ) {


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
    // Retornar versión actualizada
    // =========================

    return await periodoPlantillaRepository.findById(id);

};