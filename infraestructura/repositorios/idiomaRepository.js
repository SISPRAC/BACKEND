import { models } from "../database/dbConnection.js";

export const idiomaRepository = {

    async create(data) {
        return await models.Idioma.create(data);
    },

    async findAll() {
        return await models.Idioma.findAll({
            order: [["nombre", "ASC"]]
        });
    },

    async findById(id) {
        return await models.Idioma.findByPk(id);
    },

    async findByName(nombre) {
        return await models.Idioma.findOne({
            where: { nombre }
        });
    },

    async delete(id) {
        return await models.Idioma.destroy({
            where: { id }
        });
    },

    async update(id, data) {
        return await models.Idioma.update(data, {
            where: { id }
        });
    }
};