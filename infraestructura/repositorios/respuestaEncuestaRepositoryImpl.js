import { models } from "../database/dbConnection.js";

export const respuestaEncuestaRepository = {

    async create(data) {
        return await models.RespuestaEncuesta.create(data);
    },

    async findByUsuarioPracticaEncuesta(
        usuario_id,
        practica_encuesta_id,
        practicante_id
    ) {
        return await models.RespuestaEncuesta.findOne({
            where: {
                usuario_id,
                practica_encuesta_id,
                practicante_id,
            },
        });
    },

    async findByPracticante(practicante_id) {
        return await models.RespuestaEncuesta.findAll({
            where: {
                practicante_id,
            },
            include: [
                {
                    model: models.PracticaEncuesta,
                    as: "practicaEncuesta",
                },
                {
                    model: models.Practicante,
                    as: "practicante",
                },
            ],
        });
    },

    async findDetalleByPracticanteYEncuesta(
        practicante_id,
        practica_encuesta_id
    ) {
        const resultado = await models.RespuestaEncuesta.findOne({
            where: {
                practicante_id,
                practica_encuesta_id,
            },
            include: [
                {
                    model: models.RespuestaPregunta,
                    include: [
                        {
                            model: models.Pregunta,
                        },
                    ],
                },
            ],
        });
        return resultado;
    },

};
