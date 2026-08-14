import { models } from "../database/dbConnection.js";

export const preguntaRepository = {

    async create(data) {

        return await models.Pregunta.create(data);

    },

    async findById(id) {

        return await models.Pregunta.findByPk(id, {

            include: [
                {
                    model: models.OpcionPregunta,
                    as: "OpcionesPregunta"
                }
            ]

        });

    },

    async findByPlantillaEncuestaId(plantilla_encuesta_id) {

        return await models.Pregunta.findAll({

            where: {
                plantilla_encuesta_id
            },

            include: [
                {
                    model: models.OpcionPregunta,
                    as: "OpcionesPregunta"
                }
            ],

            order: [
                ["orden", "ASC"]
            ]

        });

    },

    async update(id, data) {

        return await models.Pregunta.update(

            data,

            {
                where: {
                    id
                }
            }

        );

    },

    async delete(id) {

        return await models.Pregunta.destroy({

            where: {
                id
            }

        });

    }

};