import { models } from "../database/dbConnection.js";

export const plantillaEncuestaRepository = {

    async create(data) {

        return await models.PlantillaEncuesta.create(data);

    },


    async update(id, data) {

        return await models.PlantillaEncuesta.update(data, {

            where: {
                id
            }

        });

    },


    async findAll() {

        return await models.PlantillaEncuesta.findAll({

            include: [

                // Rol de la encuesta
                {
                    model: models.Rol
                },


                // Versiones de la encuesta por periodo
                {
                    model: models.PeriodoPlantilla,
                    as: "periodosPlantilla",

                    include: [

                        // Periodo
                        {
                            model: models.Periodo
                        },


                        // Preguntas de esa versión
                        {
                            model: models.Pregunta,
                            as: "preguntas",

                            include: [

                                {
                                    model: models.OpcionPregunta
                                }

                            ]

                        },


                        // Aplicaciones de la encuesta
                        {
                            model: models.PracticaEncuesta,
                            as: "practicas",

                            include: [

                                {
                                    model: models.RespuestaEncuesta,
                                    as: "respuestas"
                                }

                            ]

                        }

                    ]

                }

            ]

        });

    },


    async findById(id) {

        return await models.PlantillaEncuesta.findByPk(id, {

            include: [

                // Rol
                {
                    model: models.Rol
                },


                // Versiones
                {
                    model: models.PeriodoPlantilla,
                    as: "periodosPlantilla",

                    include: [

                        // Periodo
                        {
                            model: models.Periodo
                        },


                        // Preguntas
                        {
                            model: models.Pregunta,
                            as: "preguntas",

                            include: [

                                {
                                    model: models.OpcionPregunta
                                }

                            ]

                        },


                        // Aplicaciones
                        {
                            model: models.PracticaEncuesta,
                            as: "practicas",

                            include: [

                                {
                                    model: models.RespuestaEncuesta,
                                    as: "respuestas"
                                }

                            ]

                        }

                    ]

                }

            ]

        });

    },


    async delete(id) {

        return await models.PlantillaEncuesta.destroy({

            where: {
                id
            }

        });

    },


    async findByRol(rol_id) {

        return await models.PlantillaEncuesta.findAll({

            where: {
                rol_id
            }

        });

    }

};