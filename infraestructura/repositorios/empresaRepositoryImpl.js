import { models } from "../database/dbConnection.js";

export const empresaRepository = {

    async create(data, transaction) {
        return await models.Empresa.create(data, {
            transaction
        });
    },

    async findById(id) {
        return await models.Empresa.findByPk(id);
    },

    async findByUserId(userId) {

        return await models.Empresa.findOne({
            where: {
                usuario_id: userId
            },

            include: [
                {
                    model: models.User,
                    attributes: [
                        "id",
                        "nombres",
                        "apellidos",
                        "correo",
                        "tipo_documento",
                        "cedula",
                        "telefono"
                    ]
                }
            ]
        });
    },

    async findByNit(nit) {
        return await models.Empresa.findOne({
            where: { nit }
        });
    },

    update: async (id, data, transaction) => {

        const empresa = await models.Empresa.findByPk(
            id,
            { transaction }
        );

        if (!empresa) {
            return null;
        }

        return await empresa.update(
            data,
            { transaction }
        );
    }

};