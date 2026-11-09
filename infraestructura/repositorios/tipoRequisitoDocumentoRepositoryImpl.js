import { Op } from "sequelize";
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

    // Listado general: SIN los requisitos del convenio
    async findAll() {

        return await models.TipoRequisitoDocumento.findAll({

            where: {
                es_requisito_convenio: false
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

    // Por rol: SIN los requisitos del convenio
    async findByRol(rol_id) {

        return await models.TipoRequisitoDocumento.findAll({

            where: {
                rol_id,
                es_requisito_convenio: false
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

    // Solo los requisitos del convenio.
    // Sin tipo_empresa => trae todos.
    // Con "publica" o "privada" => los de ese tipo + los que aplican a ambas (null).
    async findRequisitosConvenio(tipo_empresa) {

        const where = {
            es_requisito_convenio: true
        };

        if (tipo_empresa) {

            where[Op.or] = [
                { tipo_empresa: null },
                { tipo_empresa }
            ];

        }

        return await models.TipoRequisitoDocumento.findAll({

            where,

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