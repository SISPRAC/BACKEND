import { Op } from "sequelize";
import { models } from "../database/dbConnection.js";

export const practicaRequisitoDocumentoRepository = {

    async create(data, transaction) {

        return await models.PracticaRequisitoDocumento.create(
            data,
            {
                transaction
            }
        );

    },

    async findById(id) {

        return await models.PracticaRequisitoDocumento.findByPk(id, {
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
        });

    },

    async findByPracticaId(practica_id) {

        return await models.PracticaRequisitoDocumento.findAll({

            where: {
                practica_id
            },

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
            ],

            order: [
                ["id", "ASC"]
            ]

        });

    },

    async update(id, data, transaction) {

        const requisito =
            await models.PracticaRequisitoDocumento.findByPk(
                id,
                { transaction }
            );

        if (!requisito) {
            return null;
        }

        await requisito.update(
            data,
            { transaction }
        );

        return requisito;

    },

    async delete(id, transaction) {

        return await models.PracticaRequisitoDocumento.destroy({

            where: {
                id
            },

            transaction

        });

    },

    async findByPracticaAndRol(practica_id, rol_id) {

        return await models.PracticaRequisitoDocumento.findAll({

            where: {
                practica_id
            },

            include: [
                {
                    model: models.TipoRequisitoDocumento,
                    as: "tipoRequisitoDocumento",

                    where: {
                        rol_id
                    },

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
            ],

            order: [
                ["id", "ASC"]
            ]

        });

    },


    // ============================================================
    // REQUISITOS DEL PRACTICANTE DE LA PRÁCTICA VIGENTE
    // ============================================================

    async findRequisitosPracticanteVigentes(user_id) {

        const candidato =
            await models.Candidato.findOne({
                where: {
                    usuario_id: user_id
                },

                include: [
                    {
                        model: models.Practicante,
                        as: "practicante"
                    }
                ]
            });

        if (!candidato?.practicante) {
            return [];
        }

        const practicaPracticante =
            await models.PracticaPracticante.findOne({
                where: {
                    practicante_id: candidato.practicante.id,
                    estado: "En curso"
                }
            });


        if (!practicaPracticante) {
            return [];
        }


        const requisitos = await models.PracticaRequisitoDocumento.findAll({

            where: {
                practica_id: practicaPracticante.practica_id,

                estado: true
            },

            include: [
                {
                    model: models.TipoRequisitoDocumento,
                    as: "tipoRequisitoDocumento",

                    where: {
                        nombre: {
                            [Op.notIn]: [
                                "Plan de Trabajo",
                                "Informe Parcial",
                                "Informe Final"
                            ]
                        }
                    },

                    include: [
                        {
                            model: models.Rol,
                            as: "rol",
                            where: {
                                nombre: "Practicante"
                            }
                        },
                        {
                            model: models.Archivo,
                            as: "plantilla"
                        }
                    ]
                },

                {
                    model: models.Practica,
                    as: "practica"
                }
            ],

            order: [
                ["id", "ASC"]
            ]

        });

        return requisitos;

    },

    async findRequisitosEmpresaVigentes(user_id) {

        const empresa = await models.Empresa.findOne({
            where: {
                usuario_id: user_id
            },
            include: [
                {
                    model: models.Convenio,
                    where: {
                        estado: "APROBADO"
                    },
                    required: false,
                    include: [
                        {
                            model: models.Vacante,
                            required: false,
                            include: [
                                {
                                    model: models.AperturaVacante,
                                    required: false,
                                    include: [
                                        {
                                            model: models.Practica,
                                            as: "practica",
                                            required: false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!empresa) {
            console.log("No se encontró una empresa para este usuario.");
            return [];
        }

        const datosEmpresa = empresa.toJSON();

        const convenios = datosEmpresa.Convenios || [];

        const practicaIds = [
            ...new Set(
                convenios.flatMap((convenio) =>
                    (convenio.Vacantes || []).flatMap((vacante) =>
                        (vacante.AperturaVacantes || [])
                            .map((apertura) => apertura.practica_id)
                            .filter(Boolean)
                    )
                )
            )
        ];

        if (practicaIds.length === 0) {
            console.log(
                "No se encontraron prácticas relacionadas con convenios aprobados."
            );
            return [];
        }

        const requisitos =
            await models.PracticaRequisitoDocumento.findAll({

                where: {
                    practica_id: {
                        [Op.in]: practicaIds
                    },
                    estado: true
                },

                include: [
                    {
                        model: models.TipoRequisitoDocumento,
                        as: "tipoRequisitoDocumento",
                        where: {
                            nombre: {
                                [Op.ne]: "Convenio"
                            }
                        },
                        include: [
                            {
                                model: models.Rol,
                                as: "rol",
                                where: {
                                    nombre: "Empresa"
                                }
                            },
                            {
                                model: models.Archivo,
                                as: "plantilla"
                            }
                        ]
                    },
                    {
                        model: models.Practica,
                        as: "practica"
                    }
                ],

                order: [["id", "ASC"]]

            });

        return requisitos;
    },


    // ============================================================
    // PLAN DE TRABAJO + INFORME PARCIAL + INFORME FINAL
    // ============================================================

    async findInformesPracticanteVigentes(rol_id, user_id) {

        const candidato =
            await models.Candidato.findOne({
                where: {
                    usuario_id: user_id
                },

                include: [
                    {
                        model: models.Practicante,
                        as: "practicante"
                    }
                ]
            });

        if (!candidato?.practicante) {
            return [];
        }

        const practicaPracticante =
            await models.PracticaPracticante.findOne({
                where: {
                    practicante_id: candidato.practicante.id,
                    estado: "En curso"
                }
            });

        if (!practicaPracticante) {
            return [];
        }

        return await models.PracticaRequisitoDocumento.findAll({

            where: {
                practica_id: practicaPracticante.practica_id,
                estado: true
            },

            include: [

                // =====================================================
                // TIPO DE REQUISITO
                // =====================================================

                {
                    model: models.TipoRequisitoDocumento,
                    as: "tipoRequisitoDocumento",

                    where: {
                        rol_id,

                        nombre: {
                            [Op.in]: [
                                "Plan de Trabajo",
                                "Informe Parcial",
                                "Informe Final"
                            ]
                        }
                    },

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
                },

                // =====================================================
                // PRÁCTICA
                // =====================================================

                {
                    model: models.Practica,
                    as: "practica"
                },

                // =====================================================
                // TRAZABILIDAD DE ENTREGAS
                // =====================================================

                {
                    model: models.EntregaInforme,
                    as: "entregasInformes",

                    where: {
                        practica_practicante_id:
                            practicaPracticante.id
                    },

                    required: false,

                    include: [

                        // =================================================
                        // ARCHIVO ENTREGADO
                        // =================================================

                        {
                            model: models.Archivo,
                            as: "archivo"
                        },

                        // =================================================
                        // TUTOR DOCENTE + USUARIO
                        // =================================================

                        {
                            model: models.TutorDocente,
                            as: "tutorDocente",

                            include: [
                                {
                                    model: models.User
                                }
                            ]
                        },

                        // =================================================
                        // TUTOR EMPRESARIAL + USUARIO
                        // =================================================

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
                        ["id", "DESC"]
                    ]
                }

            ],

            order: [
                ["id", "ASC"]
            ]
        });

    },

};