import { models } from "../database/dbConnection.js";

export const empresaRepository = {

    async create(data, transaction) {
        return await models.Empresa.create(data, {
            transaction
        });
    },

    async findByUserId(userId) {
        return await models.Empresa.findOne({
            where: { user_id: userId }
        });
    },

    async findByNit(nit) {
        return await models.Empresa.findOne({
            where: { nit }
        });
    }
}