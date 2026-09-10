import { models } from "../database/dbConnection.js";

export const tipoInformeRepository = {

    async create(data, transaction) {

        return await models.TipoInforme.create(
            data,
            {
                transaction
            }
        );

    },

    async findById(id) {

        return await models.TipoInforme.findByPk(id, {
            include: [
                {
                    model: models.Archivo,
                    as: "plantilla"
                }
            ]
        });

    },

    async findAll() {

        return await models.TipoInforme.findAll({

            include: [
                {
                    model: models.Archivo,
                    as: "plantilla"
                }
            ],

            order: [
                ["id", "ASC"]
            ]

        });

    },

    async update(id, data, transaction) {

        const tipo =
            await models.TipoInforme.findByPk(
                id,
                { transaction }
            );

        if (!tipo) {
            return null;
        }

        await tipo.update(
            data,
            { transaction }
        );

        return tipo;

    },

    async delete(id, transaction) {

        return await models.TipoInforme.destroy({

            where: {
                id
            },

            transaction

        });

    }

};