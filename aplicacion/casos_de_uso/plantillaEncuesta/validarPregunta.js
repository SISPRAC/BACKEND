import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const TIPOS_PREGUNTA = ["opcion_unica", "opcion_multiple", "texto_libre"];

export const validarPregunta = (pregunta) => {

    if (!pregunta.texto || !pregunta.texto.trim()) {
        throw new BadRequestError(
            "Todas las preguntas deben tener un enunciado"
        );
    }

    const tipo = pregunta.tipo ?? "opcion_unica";

    if (!TIPOS_PREGUNTA.includes(tipo)) {
        throw new BadRequestError(
            `El tipo "${tipo}" de la pregunta "${pregunta.texto}" no es válido`
        );
    }

    // El texto libre no lleva opciones
    if (tipo === "texto_libre") {
        return tipo;
    }

    if (
        !Array.isArray(pregunta.opciones) ||
        pregunta.opciones.length < 2
    ) {
        throw new BadRequestError(
            `La pregunta "${pregunta.texto}" debe tener al menos dos opciones`
        );
    }

    for (const opcion of pregunta.opciones) {
        if (!opcion.texto || !opcion.texto.trim()) {
            throw new BadRequestError(
                `La pregunta "${pregunta.texto}" tiene una opción vacía`
            );
        }
    }

    return tipo;
};