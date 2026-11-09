import { models } from "../database/dbConnection.js";

export const habilidadBlandaRepository = {

    async create(data, transaction) {
        return await models.HabilidadBlanda.create(data, {
            transaction
        });
    },

    async findAll() {
        return await models.HabilidadBlanda.findAll({
            order: [["nombre", "ASC"]]
        });
    },

    async findById(id) {
        return await models.HabilidadBlanda.findByPk(id);
    },

    async findByName(nombre) {
        return await models.HabilidadBlanda.findOne({
            where: { nombre }
        });
    },

    async delete(id) {
        return await models.HabilidadBlanda.destroy({
            where: { id }
        });
    },

    async update(id, data) {
        return await models.HabilidadBlanda.update(data, {
            where: { id }
        });
    }
};