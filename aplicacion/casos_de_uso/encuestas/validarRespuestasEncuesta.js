import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const validarRespuestasEncuesta = (preguntasEncuesta, respuestas) => {

    const filas = [];
    const preguntasRespondidas = new Set();

    for (const respuesta of respuestas) {

        if (!respuesta.pregunta_id) {
            throw new BadRequestError(
                "Todas las respuestas deben tener una pregunta y un valor"
            );
        }

        const pregunta = preguntasEncuesta.find(
            (p) => Number(p.id) === Number(respuesta.pregunta_id)
        );

        if (!pregunta) {
            throw new BadRequestError(
                `La pregunta ${respuesta.pregunta_id} no pertenece a esta encuesta`
            );
        }

        if (preguntasRespondidas.has(Number(pregunta.id))) {
            throw new BadRequestError(
                `La pregunta ${pregunta.id} fue respondida más de una vez`
            );
        }

        preguntasRespondidas.add(Number(pregunta.id));

        const tipo = pregunta.tipo ?? "opcion_unica";
        const opciones = pregunta.opciones ?? pregunta.OpcionesPregunta ?? [];
        const textosValidos = opciones.map((o) => o.texto.trim());

        // -------------------------
        // Texto libre
        // -------------------------
        if (tipo === "texto_libre") {

            if (
                typeof respuesta.respuesta !== "string" ||
                !respuesta.respuesta.trim()
            ) {
                throw new BadRequestError(
                    `La pregunta "${pregunta.texto}" requiere una respuesta escrita`
                );
            }

            filas.push({
                pregunta_id: pregunta.id,
                respuesta: respuesta.respuesta.trim(),
            });

            continue;
        }

        // -------------------------
        // Opción múltiple (llega un arreglo)
        // -------------------------
        if (tipo === "opcion_multiple") {

            if (
                !Array.isArray(respuesta.respuesta) ||
                respuesta.respuesta.length === 0
            ) {
                throw new BadRequestError(
                    `La pregunta "${pregunta.texto}" requiere al menos una opción`
                );
            }

            const elegidas = [...new Set(respuesta.respuesta.map((r) => String(r).trim()))];

            for (const elegida of elegidas) {
                if (!textosValidos.includes(elegida)) {
                    throw new BadRequestError(
                        `"${elegida}" no es una opción válida de la pregunta "${pregunta.texto}"`
                    );
                }
                filas.push({ pregunta_id: pregunta.id, respuesta: elegida });
            }

            continue;
        }

        // -------------------------
        // Opción única
        // -------------------------
        if (
            respuesta.respuesta === undefined ||
            respuesta.respuesta === null ||
            String(respuesta.respuesta).trim() === ""
        ) {
            throw new BadRequestError(
                "Todas las respuestas deben tener una pregunta y un valor"
            );
        }

        const elegida = String(respuesta.respuesta).trim();

        if (!textosValidos.includes(elegida)) {
            throw new BadRequestError(
                `"${elegida}" no es una opción válida de la pregunta "${pregunta.texto}"`
            );
        }

        filas.push({ pregunta_id: pregunta.id, respuesta: elegida });
    }

    return filas;
};