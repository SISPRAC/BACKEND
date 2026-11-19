import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { validarPregunta } from "./validarPregunta.js";

export const actualizarPlantillaEncuesta = async (
    plantillaEncuestaRepository,
    practicaEncuestaRepository,
    preguntaRepository,
    opcionPreguntaRepository,
    respuestaEncuestaRepository,
    rolRepository,
    id,
    data
) => {

    // =========================
    // Buscar plantilla
    // =========================

    const plantilla =
        await plantillaEncuestaRepository.findById(id);

    if (!plantilla) {
        throw new NotFoundError(
            "La plantilla de encuesta no existe"
        );
    }


    // =========================
    // Verificar si ya fue utilizada
    // =========================

    const usos =
        await practicaEncuestaRepository.countByPlantilla(id);

    if (usos > 0) {
        throw new ConflictError(
            "No se puede modificar una plantilla que ya fue utilizada en una práctica. Cree una nueva plantilla."
        );
    }


    // =========================
    // Validar preguntas antes de tocar la BD
    // =========================

    if (data.preguntas) {
        data.preguntas.forEach(validarPregunta);
    }


    // =========================
    // Actualizar información
    // =========================

    if (
        data.titulo !== undefined ||
        data.descripcion !== undefined ||
        data.rol !== undefined
    ) {

        const datosActualizar = {};

        if (data.titulo !== undefined) {
            datosActualizar.titulo = data.titulo;
        }

        if (data.descripcion !== undefined) {
            datosActualizar.descripcion = data.descripcion;
        }

        // =========================
        // Buscar rol por nombre
        // =========================

        if (data.rol !== undefined) {

            const rolEncontrado =
                await rolRepository.findByNombre(data.rol);

            if (!rolEncontrado) {
                throw new NotFoundError(
                    `El rol "${data.rol}" no existe`
                );
            }

            datosActualizar.rol_id = rolEncontrado.id;
        }

        await plantillaEncuestaRepository.update(
            id,
            datosActualizar
        );
    }


    // =========================
    // Actualizar preguntas
    // =========================

    if (data.preguntas) {

        const preguntasActuales =
            plantilla.Preguntas || [];


        // =========================
        // Eliminar preguntas que ya no vienen
        // =========================

        for (const preguntaActual of preguntasActuales) {

            const existe =
                data.preguntas.some(
                    pregunta => pregunta.id === preguntaActual.id
                );

            if (!existe) {

                const respuestas =
                    await respuestaEncuestaRepository.countByPregunta(
                        preguntaActual.id
                    );

                if (respuestas === 0) {

                    // Primero eliminar sus opciones
                    const opciones =
                        preguntaActual.OpcionesPregunta || [];

                    for (const opcion of opciones) {
                        await opcionPreguntaRepository.delete(opcion.id);
                    }

                    // Luego eliminar pregunta
                    await preguntaRepository.delete(preguntaActual.id);
                }
            }
        }


        // =========================
        // Crear / actualizar preguntas
        // =========================

        for (const pregunta of data.preguntas) {

            const tipo = pregunta.tipo ?? "opcion_unica";

            // -------------------------
            // Pregunta existente
            // -------------------------

            if (pregunta.id) {

                await preguntaRepository.update(
                    pregunta.id,
                    {
                        texto: pregunta.texto,
                        orden: pregunta.orden,
                        tipo
                    }
                );

                const preguntaBD =
                    await preguntaRepository.findById(pregunta.id);

                const opcionesActuales =
                    preguntaBD.OpcionesPregunta || [];

                // Si es texto libre, se borran todas sus opciones
                if (tipo === "texto_libre") {

                    for (const opcionActual of opcionesActuales) {
                        await opcionPreguntaRepository.delete(opcionActual.id);
                    }

                    continue;
                }

                // Eliminar opciones que ya no vienen
                for (const opcionActual of opcionesActuales) {

                    const existe = pregunta.opciones.some(
                        opcion => opcion.id === opcionActual.id
                    );

                    if (!existe) {
                        await opcionPreguntaRepository.delete(opcionActual.id);
                    }
                }

                // Crear / actualizar opciones
                for (const opcion of pregunta.opciones) {

                    if (opcion.id) {
                        await opcionPreguntaRepository.update(
                            opcion.id,
                            { texto: opcion.texto }
                        );
                    } else {
                        await opcionPreguntaRepository.create({
                            pregunta_id: pregunta.id,
                            texto: opcion.texto
                        });
                    }
                }
            }

            // -------------------------
            // Pregunta nueva
            // -------------------------

            else {

                const nuevaPregunta =
                    await preguntaRepository.create({
                        plantilla_encuesta_id: id,
                        texto: pregunta.texto,
                        orden: pregunta.orden,
                        tipo
                    });

                if (tipo === "texto_libre") continue;

                for (const opcion of pregunta.opciones) {
                    await opcionPreguntaRepository.create({
                        pregunta_id: nuevaPregunta.id,
                        texto: opcion.texto
                    });
                }
            }
        }
    }


    // =========================
    // Retornar plantilla completa
    // =========================

    return await plantillaEncuestaRepository.findById(id);
};