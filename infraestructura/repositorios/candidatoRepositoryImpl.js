import { Sequelize } from "sequelize";
import { models } from "../database/dbConnection.js";

export const candidatoRepository = {

    async create(data, transaction) {
        return await models.Candidato.create(data, {
            transaction
        });
    },

    async findById(id, transaction) {
        return await models.Candidato.findByPk(
            id,
            { transaction }
        );
    },

    async findByUserId(userId, transaction) {
        return await models.Candidato.findOne({
            where: {
                usuario_id: userId
            },
            transaction
        });
    },

    async findByCodigo(codigo) {
        return await models.Candidato.findOne({
            where: { codigo }
        });
    },

    async findByAll() {
        return await models.Candidato.findAll({
            include: [
                {
                    model: models.User,
                    attributes: [
                        "nombres",
                        "apellidos"
                    ]
                }
            ]
        });
    },

    async getDisponibles() {
        return await models.Candidato.findAll({
            include: [
                {
                    model: models.User,
                    attributes: [
                        "nombres",
                        "apellidos"
                    ]
                },
                {
                    model: models.GrupoCandidato,
                    as: "gruposAsignados",
                    required: false,
                    attributes: []
                }
            ],
            where: {
                "$gruposAsignados.id$": null
            }
        });
    },

    async update(id, data, transaction) {

        const candidato = await models.Candidato.findByPk(
            id,
            { transaction }
        );

        if (!candidato) {
            return null;
        }

        return await candidato.update(
            data,
            { transaction }
        );
    },

    async findByPerfil(nombrePerfil) {

        return await models.Candidato.findAll({

            where: {
                id: {
                    [Sequelize.Op.notIn]: Sequelize.literal(`(
                        SELECT DISTINCT candidato_id
                        FROM "Postulacions"
                        WHERE estado IN ('POSTULADO', 'ACEPTADO')
                    )`)
                }
            },

            include: [

                {
                    model: models.User,
                    attributes: [
                        "nombres",
                        "apellidos"
                    ]
                },

                {
                    model: models.Perfil,

                    where: {
                        nombre: nombrePerfil
                    },

                    through: {
                        attributes: [
                            "calificacion"
                        ]
                    }
                }

            ]

        });

    },


    async findAllParaReportePorPeriodo(periodo_id) {
        return await models.Candidato.findAll({
            attributes: [
                "id",
                "codigo",
                "usuario_id"
            ],

            include: [
                {
                    model: models.User,
                    attributes: [
                        "id",
                        "nombres",
                        "apellidos",
                        "correo"
                    ],
                    required: true
                },

                {
                    model: models.Practicante,
                    as: "practicante",
                    attributes: ["id", "candidato_id"],
                    required: false,
                    include: [
                        {
                            model: models.PracticaPracticante,
                            as: "practicas",
                            attributes: [
                                "id",
                                "estado",
                                "practicante_id",
                                "practica_id"
                            ],
                            required: false,
                            include: [
                                {
                                    model: models.Practica,
                                    as: "practica",
                                    attributes: [
                                        "id",
                                        "periodo_id",
                                        "estado"
                                    ],
                                    where: { periodo_id },
                                    required: true
                                }
                            ]
                        }
                    ]
                },

                {
                    model: models.Postulacion,
                    attributes: [
                        "id",
                        "estado",
                        "candidato_id",
                        "aperturaVacante_id"
                    ],
                    required: false,
                    include: [
                        {
                            model: models.AperturaVacante,
                            attributes: [
                                "id",
                                "practica_id",
                                "vacante_id",
                                "estado"
                            ],
                            required: true,
                            include: [
                                {
                                    model: models.Practica,
                                    as: "practica",
                                    attributes: [
                                        "id",
                                        "periodo_id",
                                        "fecha_inicio",
                                        "fecha_fin",
                                        "estado"
                                    ],
                                    where: { periodo_id },
                                    required: true
                                },
                                {
                                    model: models.Vacante,
                                    attributes: [
                                        "id",
                                        "nombre"
                                    ],
                                    required: true,
                                    include: [
                                        {
                                            model: models.Convenio,
                                            attributes: [
                                                "id",
                                                "estado"
                                            ],
                                            required: true,
                                            include: [
                                                {
                                                    model: models.Empresa,
                                                    attributes: [
                                                        "id",
                                                        "nombre"
                                                    ],
                                                    required: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    model: models.GrupoCandidato,
                    as: "gruposAsignados",
                    attributes: ["id", "grupo_id"],
                    required: false,
                    include: [
                        {
                            model: models.Grupo,
                            as: "grupo",
                            attributes: ["id", "nombre"],
                            required: false
                        }
                    ]
                }
            ],

            distinct: true,
            order: [["id", "ASC"]]
        });
    },


};