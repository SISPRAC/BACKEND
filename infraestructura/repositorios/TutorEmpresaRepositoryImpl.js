import { models } from "../database/dbConnection.js";

export const tutorEmpresaRepository = {

    async create(data, transaction) {
        return await models.TutorEmpresa.create(data, {
            transaction
        });
    },

    async findById(id) {

        return await models.TutorEmpresa.findByPk(id, {
            include: [
                {
                    model: models.User
                }
            ]
        });

    },

    async findByUserId(usuarioId) {

        return await models.TutorEmpresa.findOne({
            where: {
                usuario_id: usuarioId
            },
            include: [
                {
                    model: models.User
                }
            ]
        });

    },


    async findByCodigo(codigo) {
        return await models.TutorEmpresa.findOne({
            where: {
                codigo
            }
        });
    },


    async findByAll() {
        return await models.TutorEmpresa.findAll({
            include: [
                {
                    model: models.User,
                }
            ]
        });
    },


    async findAperturasByTutorEmpresa(userId, periodoId, practicaId) {

        const tutorEmpresa = await models.TutorEmpresa.findOne({
            where: {
                usuario_id: userId
            }
        });

        if (!tutorEmpresa) {
            return [];
        }

        const wherePractica = {};

        if (practicaId) {
            wherePractica.id = practicaId;
        }

        if (periodoId) {
            wherePractica.periodo_id = periodoId;
        }

        return await models.AperturaVacante.findAll({
            where: {
                tutorEmpresa_id: tutorEmpresa.id
            },

            include: [
                {
                    model: models.Practica,
                    as: "practica",
                    where: wherePractica,

                    include: [
                        {
                            model: models.Periodo
                        }
                    ]
                },

                {
                    model: models.Vacante
                },

                {
                    model: models.Postulacion,
                    where: {
                        estado: "ACEPTADO"
                    },
                    required: false
                }
            ],

            order: [
                [
                    { model: models.Practica, as: "practica" },
                    "fecha_inicio",
                    "DESC"
                ]
            ]
        });
    },


    async findAperturasByPractica(userId, practicaId) {

        const tutorEmpresa = await models.TutorEmpresa.findOne({
            where: {
                usuario_id: userId
            }
        });

        if (!tutorEmpresa) {
            return [];
        }

        return await models.AperturaVacante.findAll({
            where: {
                tutorEmpresa_id: tutorEmpresa.id,
                practica_id: practicaId
            },

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
                    model: models.Vacante
                },

                {
                    model: models.Postulacion,
                    required: false,

                    include: [
                        {
                            model: models.Candidato,

                            include: [
                                {
                                    model: models.User
                                },

                                {
                                    model: models.Practicante,
                                    as: "practicante",

                                    include: [
                                        {
                                            model: models.PracticaPracticante,
                                            as: "practicas",

                                            where: {
                                                practica_id: practicaId
                                            },

                                            required: false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],

            order: [
                ["id", "ASC"]
            ]
        });
    }

}; 