import { models } from "../database/dbConnection.js";

export const departamentoRepository = {

    async findAll() {
        return await models.Departamento.findAll({
            order: [["nombre", "ASC"]]
        });
    },

    async findById(id, transaction) {
        return await models.Departamento.findByPk(
            id,
            {
                transaction
            }
        );
    },

    async findByCodigo(codigo, transaction) {
        return await models.Departamento.findOne({
            where: {
                codigo
            },
            transaction
        });
    }
};