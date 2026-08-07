import { models } from "../database/dbConnection.js";

export const periodoPlantillaRepository = {

    // =========================
    // Crear PeriodoPlantilla
    // =========================

    async create(data) {

        return await models.PeriodoPlantilla.create(data);

    },


    // =========================
    // Actualizar PeriodoPlantilla
    // =========================

    async update(id, data) {

        return await models.PeriodoPlantilla.update(data, {

            where: {
                id
            }

        });

    },


    // =========================
    // Buscar todas
    // =========================

    async findAll() {

        return await models.PeriodoPlantilla.findAll({

            include: [

                // Plantilla base
                {
                    model: models.PlantillaEncuesta,
                    as: "plantilla",

                    include: [

                        {
                            model: models.Rol
                        }

                    ]

                },


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

        });

    },


    // =========================
    // Buscar por ID
    // =========================

    async findById(id) {

        return await models.PeriodoPlantilla.findByPk(id, {

            include: [

                // Plantilla base
                {
                    model: models.PlantillaEncuesta,
                    as: "plantilla",

                    include: [

                        {
                            model: models.Rol
                        }

                    ]

                },


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

        });

    },


    // =========================
    // Eliminar
    // =========================

    async delete(id) {

        return await models.PeriodoPlantilla.destroy({

            where: {
                id
            }

        });

    },


    // =========================
    // Buscar por periodo
    // =========================

    async findByPeriodo(periodo_id) {

        return await models.PeriodoPlantilla.findAll({

            where: {
                periodo_id
            }

        });

    },


    // =========================
    // Buscar por plantilla
    // =========================

    async findByPlantilla(plantilla_encuesta_id) {

        return await models.PeriodoPlantilla.findAll({

            where: {
                plantilla_encuesta_id
            }

        });

    }

};