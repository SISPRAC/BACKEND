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

    async findById(id) {

        return await models.EntregaInforme.findByPk(id, {

            include: [
                {
                    model: models.PracticaInforme,
                    as: "practicaInforme",

                    include: [
                        {
                            model: models.TipoInforme,
                            as: "tipoInforme",

                            include: [
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
                    as: "practicaPracticante"
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

    async findByPracticaInformeId(practica_informe_id) {

        return await models.EntregaInforme.findAll({

            where: {
                practica_informe_id
            },

            include: [
                {
                    model: models.PracticaPracticante,
                    as: "practicaPracticante"
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
                ["version", "DESC"]
            ]

        });

    },

    async findByPracticaPracticanteId(practica_practicante_id) {

        return await models.EntregaInforme.findAll({

            where: {
                practica_practicante_id
            },

            include: [
                {
                    model: models.PracticaInforme,
                    as: "practicaInforme",

                    include: [
                        {
                            model: models.TipoInforme,
                            as: "tipoInforme"
                        }
                    ]
                },

                {
                    model: models.Archivo,
                    as: "archivo"
                }
            ],

            order: [
                ["practica_informe_id", "ASC"],
                ["version", "DESC"]
            ]

        });

    },

    async findByPracticaPracticanteAndInforme(
        practica_practicante_id,
        practica_informe_id
    ) {

        return await models.EntregaInforme.findAll({

            where: {
                practica_practicante_id,
                practica_informe_id
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

    async findLatestVersion(
        practica_practicante_id,
        practica_informe_id,
        transaction
    ) {

        return await models.EntregaInforme.findOne({

            where: {
                practica_practicante_id,
                practica_informe_id
            },

            order: [
                ["version", "DESC"]
            ],

            transaction

        });

    },

    async update(id, data, transaction) {

        const entrega =
            await models.EntregaInforme.findByPk(
                id,
                { transaction }
            );

        if (!entrega) {
            return null;
        }

        await entrega.update(
            data,
            { transaction }
        );

        return entrega;

    }

};