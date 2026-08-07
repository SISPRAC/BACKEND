import { models } from "../database/dbConnection.js";

export const perfilRepository = {

    async create(data) {
        return await models.Perfil.create(data);
    },

    async findAll() {
        return await models.Perfil.findAll();
    },

    async findById(id) {
        return await models.Perfil.findByPk(id);
    },

    async findByName(nombre) {
        return await models.Perfil.findOne({
            where: { nombre }
        });
    },

    async delete(id) {
        return await models.Perfil.destroy({
            where: { id }
        });
    },

    async update(id, data) {
        return await models.Perfil.update(data, {
            where: { id }
        });
    }
};