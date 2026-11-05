import { models } from "../database/dbConnection.js";

export const tipoRequisitoDocumentoRepository = {

    async create(data, transaction) {

        return await models.TipoRequisitoDocumento.create(
            data,
            {
                transaction
            }
        );

    },

    async findById(id) {

        return await models.TipoRequisitoDocumento.findByPk(id, {

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

        });

    },

    async findAll() {

        return await models.TipoRequisitoDocumento.findAll({

            include: [

                {
                    model: models.Rol,
                    as: "rol"
                },

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

    async findByRol(rol_id) {

        return await models.TipoRequisitoDocumento.findAll({

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

            ],

            order: [
                ["id", "ASC"]
            ]

        });

    },

    async update(id, data, transaction) {

        const tipo =
            await models.TipoRequisitoDocumento.findByPk(
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

        return await models.TipoRequisitoDocumento.destroy({

            where: {
                id
            },

            transaction

        });

    }

};