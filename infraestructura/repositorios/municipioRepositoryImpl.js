import { models } from "../database/dbConnection.js";

export const municipioRepository = {

    async findByDepartamentoId(departamentoId, transaction) {
        return await models.Municipio.findAll({
            where: {
                departamento_id: departamentoId
            },
            order: [["nombre", "ASC"]],
            transaction
        });
    },

    async findById(id, transaction) {
        return await models.Municipio.findByPk(
            id,
            {
                transaction
            }
        );
    },

    async findByCodigo(codigo, transaction) {
        return await models.Municipio.findOne({
            where: {
                codigo
            },
            transaction
        });
    }
};