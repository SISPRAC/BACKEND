import { models } from "../database/dbConnection.js";

export const entregaInformeRepository = {

    async create(data, transaction) {

        return await models.EntregaInforme.create(
            data,
            {
                transaction
            }
        );

    },

    // ============================================================
    // BUSCAR LA PRÁCTICA DEL PRACTICANTE POR USER ID
    // ============================================================

    async findPracticaPracticanteByUserId(user_id) {

        return await models.PracticaPracticante.findOne({

            where: {
                estado: "En curso"
            },

            include: [

                {
                    model: models.Practicante,
                    as: "practicante",

                    required: true,

                    include: [

                        {
                            model: models.Candidato,
                            as: "candidato",

                            required: true,

                            where: {
                                usuario_id: user_id
                            }

                        }

                    ]

                },

                {
                    model: models.Practica,
                    as: "practica"
                }

            ]

        });

    },

    // ============================================================
    // BUSCAR ENTREGA POR ID
    // ============================================================

    async findById(id) {

        return await models.EntregaInforme.findByPk(id, {

            include: [

                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",

                    include: [

                        {
                            model: models.TipoRequisitoDocumento,
                            as: "tipoRequisitoDocumento",

                            include: [

                                {
                                    model: models.Rol,
                                    as: "rol"
                                },

                                {
                                    model: models.Archivo,
                                    as: "plantilla"
                                }

                            ]

                        }

                    ]

                },

                {
                    model: models.PracticaPracticante,
                    as: "practicaPracticante",

                    include: [

                        {
                            model: models.Practicante,
                            as: "practicante"
                        },

                        {
                            model: models.Practica,
                            as: "practica"
                        }

                    ]

                },

                {
                    model: models.Archivo,
                    as: "archivo"
                },

                {
                    model: models.TutorDocente,
                    as: "tutorDocente",

                    include: [
                        {
                            model: models.User
                        }
                    ]

                },

                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial",

                    include: [
                        {
                            model: models.User
                        }
                    ]

                }

            ]

        });

    },


    // ============================================================
    // ENTREGAS DE UNA PRÁCTICA-PRACTICANTE
    // ============================================================

    async findByPracticaPracticanteId(practica_practicante_id) {

        return await models.EntregaInforme.findAll({

            where: {
                practica_practicante_id
            },

            include: [

                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",

                    include: [

                        {
                            model: models.TipoRequisitoDocumento,
                            as: "tipoRequisitoDocumento"
                        }

                    ]

                },

                {
                    model: models.Archivo,
                    as: "archivo"
                },

                {
                    model: models.TutorDocente,
                    as: "tutorDocente",

                    include: [
                        {
                            model: models.User
                        }
                    ]

                },

                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial",

                    include: [
                        {
                            model: models.User
                        }
                    ]

                }

            ],

            order: [
                ["practica_requisito_documento_id", "ASC"],
                ["version", "DESC"]
            ]

        });

    },


    // ============================================================
    // ENTREGAS DE UN REQUISITO ESPECÍFICO
    // ============================================================

    async findByPracticaPracticanteAndRequisito(
        practica_practicante_id,
        practica_requisito_documento_id
    ) {

        return await models.EntregaInforme.findAll({

            where: {
                practica_practicante_id,
                practica_requisito_documento_id
            },

            include: [

                {
                    model: models.Archivo,
                    as: "archivo"
                },

                {
                    model: models.TutorDocente,
                    as: "tutorDocente"
                },

                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial"
                }

            ],

            order: [
                ["version", "DESC"]
            ]

        });

    },


    // ============================================================
    // ÚLTIMA VERSIÓN
    // ============================================================

    async findLatestVersion(
        practica_practicante_id,
        practica_requisito_documento_id,
        transaction
    ) {

        return await models.EntregaInforme.findOne({

            where: {
                practica_practicante_id,
                practica_requisito_documento_id
            },

            order: [
                ["version", "DESC"]
            ],

            transaction

        });

    },


    // ============================================================
    // ACTUALIZAR ENTREGA
    // ============================================================

    async update(id, data, transaction) {

        const entrega =
            await models.EntregaInforme.findByPk(
                id,
                {
                    transaction
                }
            );

        if (!entrega) {
            return null;
        }

        await entrega.update(
            data,
            {
                transaction
            }
        );

        return entrega;

    },

    async findPracticaPracticanteByUserIdAndPracticaId(
        user_id,
        practica_id
    ) {
        return await models.PracticaPracticante.findOne({
            where: {
                practica_id
            },
            include: [
                {
                    model: models.Practicante,
                    as: "practicante",
                    required: true,
                    include: [
                        {
                            model: models.Candidato,
                            as: "candidato",
                            required: true,
                            where: {
                                usuario_id: user_id
                            }
                        }
                    ]
                },
                {
                    model: models.Practica,
                    as: "practica"
                }
            ]
        });
    },

    async findByPracticanteAndTipoRequisito(
        practicante_id,
        tipo_requisito_documento_id
    ) {

        return await models.EntregaInforme.findAll({

            include: [
                {
                    model: models.PracticaPracticante,
                    as: "practicaPracticante",
                    required: true,
                    where: {
                        practicante_id
                    },
                    include: [
                        {
                            model: models.Practica,
                            as: "practica"
                        }
                    ]
                },
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                    required: true,
                    where: {
                        id: tipo_requisito_documento_id
                    },
                    include: [
                        {
                            model: models.TipoRequisitoDocumento,
                            as: "tipoRequisitoDocumento",
                            required: true,
                            include: [
                                {
                                    model: models.Rol,
                                    as: "rol"
                                }
                            ]
                        }
                    ]
                },
                {
                    model: models.Archivo,
                    as: "archivo"
                },
                {
                    model: models.TutorDocente,
                    as: "tutorDocente"
                },
                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial"
                }
            ],

            order: [
                ["version", "DESC"]
            ]

        });
    }

};