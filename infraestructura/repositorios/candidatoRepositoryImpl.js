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
                        "correo",
                        "cedula"
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
                                "objetivo",
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
                                    attributes: ["id"],
                                    required: true,
                                    include: [
                                        {
                                            model: models.Convenio,
                                            attributes: ["id", "estado"],
                                            required: true,
                                            include: [
                                                {
                                                    model: models.Empresa,
                                                    attributes: ["id", "nombre"],
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

    // Agrégalo dentro de candidatoRepository (backend), junto a findByAll
    async findAllConPerfiles() {
        return await models.Candidato.findAll({
            include: [
                {
                    model: models.User,
                    attributes: ["nombres", "apellidos", "correo", "telefono"],
                    required: true,
                    include: [
                        {
                            model: models.Rol,
                            attributes: [],
                            where: { nombre: "Candidato" }, // ajusta al nombre real de la columna/valor
                            through: { attributes: [] },
                            required: true
                        }
                    ]
                },
                {
                    model: models.Perfil,
                    required: false,
                    through: { attributes: ["nivel"] }
                },
                {
                    model: models.HabilidadBlanda,
                    as: "habilidadesBlandas",
                    required: false,
                    through: { attributes: [] }
                },
                {
                    model: models.Idioma,
                    as: "idiomas",
                    required: false,
                    through: { attributes: ["lee", "habla", "escucha"] }
                }
            ],
            order: [["id", "ASC"]]
        });
    },

    async findByCorreosOCodigos(correos = [], codigos = []) {
        return await models.Candidato.findAll({
            attributes: ["id", "codigo"],
            include: [
                {
                    model: models.User,
                    attributes: ["id", "nombres", "apellidos", "correo"],
                    required: true
                }
            ],
            where: {
                [Sequelize.Op.or]: [
                    { codigo: { [Sequelize.Op.in]: codigos } },
                    Sequelize.where(
                        Sequelize.fn("lower", Sequelize.col("Usuario.correo")),
                        { [Sequelize.Op.in]: correos }
                    )
                ]
            }
        });
    },


};