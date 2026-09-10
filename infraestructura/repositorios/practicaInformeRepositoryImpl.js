import { models } from "../database/dbConnection.js";

export const practicaInformeRepository = {

    async create(data, transaction) {

        return await models.PracticaInforme.create(
            data,
            {
                transaction
            }
        );

    },

    async findById(id) {

        return await models.PracticaInforme.findByPk(id, {

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

        });

    },

    async findByPracticaId(practica_id) {

        return await models.PracticaInforme.findAll({

            where: {
                practica_id
            },

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
            ],

            order: [
                ["id", "ASC"]
            ]

        });

    },

    async update(id, data, transaction) {

        const informe =
            await models.PracticaInforme.findByPk(
                id,
                { transaction }
            );

        if (!informe) {
            return null;
        }

        await informe.update(
            data,
            { transaction }
        );

        return informe;

    },

    async delete(id, transaction) {

        return await models.PracticaInforme.destroy({

            where: {
                id
            },

            transaction

        });

    }

};