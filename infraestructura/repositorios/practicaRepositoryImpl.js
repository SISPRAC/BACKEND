import { models } from "../database/dbConnection.js";

export const practicaRepository = {

    async create(data, transaction) {
        return await models.Practica.create(data, { transaction });
    },

    async findById(id) {
        return await models.Practica.findOne({
            where: { id }
        });
    },

    async findByPeriodoId(periodo_id) {
        return await models.Practica.findOne({
            where: { periodo_id }
        });
    },

    async findByAll() {
        return await models.Practica.findAll({
            include: [
                {
                    model: models.Periodo,
                    attributes: [
                        "id",
                        "nombre",
                        "fecha_inicio",
                        "fecha_fin"
                    ]
                }
            ]
        });
    },

    async update(id, data, transaction) {
        return await models.Practica.update(
            data,
            {
                where: { id },
                transaction
            }
        );
    },

    async delete(id, transaction) {
        return await models.Practica.destroy({
            where: { id },
            transaction
        });
    },

    async tienePracticaPracticantes(practica_id) {
        return await models.PracticaPracticante.count({
            where: {
                practica_id
            }
        });
    },

};