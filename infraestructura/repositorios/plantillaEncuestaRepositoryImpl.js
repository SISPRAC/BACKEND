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

                {
                    model: models.Rol
                },

                {
                    model: models.Pregunta,
                    as: "preguntas",
                    attributes: ["id"]
                },

                {
                    model: models.PracticaEncuesta,
                    as: "practicas",

                    include: [

                        {
                            model: models.Practica,
                            as: "practica",

                            include: [
                                {
                                    model: models.Periodo
                                }
                            ]

                        },

                        {
                            model: models.RespuestaEncuesta,
                            as: "respuestas"
                        }

                    ]

                }

            ]

        });

    },

    async findById(id) {

        return await models.PlantillaEncuesta.findByPk(id, {

            include: [

                // =============================
                // ROL
                // =============================

                {
                    model: models.Rol
                },

                // =============================
                // PREGUNTAS
                // =============================

                {
                    model: models.Pregunta,
                    as: "preguntas",

                    include: [

                        // =============================
                        // OPCIONES DE LA PREGUNTA
                        // =============================

                        {
                            model: models.OpcionPregunta
                        }

                    ]

                },

                // =============================
                // PRÁCTICAS DONDE SE UTILIZA
                // =============================

                {
                    model: models.PracticaEncuesta,
                    as: "practicas",

                    include: [

                        // =============================
                        // PRÁCTICA
                        // =============================

                        {
                            model: models.Practica,
                            as: "practica",

                            include: [
                                {
                                    model: models.Periodo
                                }
                            ]
                        },

                        // =============================
                        // RESPUESTAS
                        // =============================

                        {
                            model: models.RespuestaEncuesta,
                            as: "respuestas"
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