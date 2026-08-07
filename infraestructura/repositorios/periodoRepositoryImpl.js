import { models } from "../database/dbConnection.js";

export const periodoRepository = {

    async create(data) {
        return await models.Periodo.create(data);
    },

    async findAll() {
        return await models.Periodo.findAll();
    },

    async findById(id) {
        return await models.Periodo.findByPk(id);
    },

    async findByName(nombre) {
        return await models.Periodo.findOne({
            where: { nombre }
        });
    },

    async delete(id) {
        return await models.Periodo.destroy({
            where: { id }
        });
    },

    async update(id, data) {
        return await models.Periodo.update(data, {
            where: { id }
        });
    },
    async estaEnUso(id) {
    return await models.Grupo.count({
        where: {
            periodo_id: id
        }
    });
}
};