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
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]

                },

                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial",

                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
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
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]

                },

                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial",

                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
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
                    as: "tutorDocente",
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]
                },

                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial",
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]
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
                    as: "tutorDocente",
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]
                },
                {
                    model: models.TutorEmpresa,
                    as: "tutorEmpresarial",
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]
                }
            ],

            order: [
                ["version", "DESC"]
            ]

        });
    },

    async updateObjetivoPracticaPracticante(practicaPracticanteId, objetivo, transaction) {
        return models.PracticaPracticante.update(
            { objetivo },
            { where: { id: practicaPracticanteId }, transaction }
        );
    },

    async findByIdParaNotificacion(id) {

        const atributosUsuario = ["id", "nombres", "apellidos", "correo"];

        return await models.EntregaInforme.findByPk(id, {
            include: [
                // Documento entregado: permite obtener "Informe 1",
                // "Plan de trabajo", etc.
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                    include: [
                        {
                            model: models.TipoRequisitoDocumento,
                            as: "tipoRequisitoDocumento",
                            attributes: ["id", "nombre"]
                        }
                    ]
                },
                {
                    model: models.PracticaPracticante,
                    as: "practicaPracticante",
                    include: [
                        {
                            model: models.Practicante,
                            as: "practicante",
                            include: [
                                {
                                    model: models.Candidato,
                                    as: "candidato",
                                    include: [
                                        {
                                            model: models.User,
                                            attributes: atributosUsuario
                                        },
                                        {
                                            model: models.Postulacion,
                                            separate: true,
                                            include: [
                                                {
                                                    model: models.AperturaVacante,
                                                    include: [
                                                        {
                                                            model: models.TutorEmpresa,
                                                            include: [
                                                                {
                                                                    model: models.User,
                                                                    attributes: atributosUsuario
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
                                            separate: true,
                                            include: [
                                                {
                                                    model: models.Grupo,
                                                    as: "grupo",
                                                    include: [
                                                        {
                                                            model: models.TutorDocente,
                                                            include: [
                                                                {
                                                                    model: models.User,
                                                                    attributes: atributosUsuario
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }

};