import { models } from "../database/dbConnection.js";
import { Op } from "sequelize";

export const aperturaVacanteRepository = {

    async create(data) {
        return await models.AperturaVacante.create(data);
    },

    async update(id, data) {
        return await models.AperturaVacante.update(data, {
            where: { id }
        });
    },

    async findById(id) {
        return await models.AperturaVacante.findByPk(id, {
            include: [
                {
                    model: models.Periodo
                }
            ]
        });
    },
    async countByAperturaVacante(aperturaVacanteId) {
    return await models.Postulacion.count({
        where: {
            aperturaVacante_id: aperturaVacanteId,
            estado: {
                [Op.in]: [
                    "POSTULADO",
                    "ACEPTADO"
                ]
            }
        }
    });
}

};