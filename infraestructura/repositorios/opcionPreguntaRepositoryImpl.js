import { models } from "../database/dbConnection.js";

export const opcionPreguntaRepository = {

    async create(data) {

        return await models.OpcionPregunta.create(data);

    },

    async findById(id) {

        return await models.OpcionPregunta.findByPk(id);

    },

    async findByPreguntaId(pregunta_id) {

        return await models.OpcionPregunta.findAll({

            where: {
                pregunta_id
            }

        });

    },

    async update(id, data) {

        return await models.OpcionPregunta.update(

            data,

            {
                where: {
                    id
                }
            }

        );

    },

    async delete(id) {

        return await models.OpcionPregunta.destroy({

            where: {
                id
            }

        });

    }

};