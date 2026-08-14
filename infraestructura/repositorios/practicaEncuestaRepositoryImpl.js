import { models } from "../database/dbConnection.js";

export const practicaEncuestaRepository = {

    async create(data) {

        return await models.PracticaEncuesta.create(data);

    },


    async findById(id) {

        return await models.PracticaEncuesta.findByPk(id, {

            include: [

                {
                    model: models.Practica,
                    as: "practica"
                },

                {
                    model: models.PlantillaEncuesta
                },

                {
                    model: models.RespuestaEncuesta,
                    as: "respuestas"
                }

            ]

        });

    },


    async findByPlantillaId(plantilla_encuesta_id) {

        return await models.PracticaEncuesta.findAll({

            where: {
                plantilla_encuesta_id
            },

            include: [

                {
                    model: models.Practica,
                    as: "practica"
                },

                {
                    model: models.RespuestaEncuesta,
                    as: "respuestas"
                }

            ]

        });

    },


    async findByPlantillaId(plantilla_encuesta_id) {

        return await models.PracticaEncuesta.findAll({

            where: {
                plantilla_encuesta_id
            },

            include: [

                {
                    model: models.Practica,
                    as: "practica"
                }

            ]

        });

    },


    async countByPlantilla(plantilla_encuesta_id) {

        return await models.PracticaEncuesta.count({

            where: {
                plantilla_encuesta_id
            }

        });

    },


    async countByPractica(practica_id) {

        return await models.PracticaEncuesta.count({

            where: {
                practica_id
            }

        });

    },


    async delete(id) {

        return await models.PracticaEncuesta.destroy({

            where: {
                id
            }

        });

    },
    async findByPracticaAndPlantilla(
        practica_id,
        plantilla_encuesta_id
    ) {

        return await models.PracticaEncuesta.findOne({

            where: {
                practica_id,
                plantilla_encuesta_id
            },

            include: [

                {
                    model: models.RespuestaEncuesta,
                    as: "respuestas"
                }

            ]

        });

    },

};