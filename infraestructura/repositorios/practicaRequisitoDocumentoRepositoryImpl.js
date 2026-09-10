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
    async findByPracticaAndRol(
        practica_id,
        rol_id
    ) {

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

};