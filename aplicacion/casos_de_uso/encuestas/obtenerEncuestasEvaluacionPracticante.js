import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerEncuestasEvaluacionPracticante = async (
    { plantillaEncuestaRepository, respuestaEncuestaRepository },
    practicante_id,
    rolEvaluador
) => {

    // Validar datos
    if (!practicante_id || !rolEvaluador) {
        throw new BadRequestError(
            "Los datos son obligatorios"
        );
    }

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

    // Filtrar las encuestas según el rol evaluador
    let encuestasDelRol = encuestas.filter(
        (encuesta) =>
            encuesta.plantilla?.Role?.nombre === rolEvaluador
    );

    // Si no hay encuestas para Empresa, buscar las de Tutor Empresarial
    if (
        rolEvaluador === "Empresa" &&
        encuestasDelRol.length === 0
    ) {
        encuestasDelRol = encuestas.filter(
            (encuesta) =>
                encuesta.plantilla?.Role?.nombre === "Tutor Empresarial"
        );
    }

    // Adjuntar a cada encuesta las respuestas de ESTE practicante
    return await Promise.all(
        encuestasDelRol.map(async (encuesta) => {

            // Pasar de instancia Sequelize a objeto plano
            const encuestaPlana = encuesta.toJSON
                ? encuesta.toJSON()
                : encuesta;

            const detalle =
                await respuestaEncuestaRepository.findDetalleByPracticanteYEncuesta(
                    practicante_id,
                    encuestaPlana.id
                );

            // Sin respuesta registrada: la encuesta sigue pendiente
            if (!detalle) {
                return {
                    ...encuestaPlana,
                    respondida: false,
                    fechaRespuesta: null,
                    respuestas: [],
                };
            }

            const detallePlano = detalle.toJSON
                ? detalle.toJSON()
                : detalle;

            // El nombre depende de cómo definiste la asociación en Sequelize
            // (sin alias, lo normal es "RespuestaPreguntas").
            const respuestasPregunta =
                detallePlano.RespuestaPreguntas ||
                detallePlano.RespuestaPregunta ||
                detallePlano.respuestas ||
                [];

            return {
                ...encuestaPlana,
                respondida: true,
                fechaRespuesta:
                    detallePlano.fecha_respuesta ??
                    detallePlano.createdAt ??
                    null,
                respuestas: respuestasPregunta.map((rp) => ({
                    pregunta_id: rp.pregunta_id,
                    respuesta: rp.respuesta,
                })),
            };
        })
    );
};