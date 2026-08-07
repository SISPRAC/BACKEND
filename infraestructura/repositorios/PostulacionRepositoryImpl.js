import { models } from "../database/dbConnection.js";

export const postulacionRepository = {

    async create(data) {
        return await models.Postulacion.create(data);
    },

    async update(id, data) {
        return await models.Postulacion.update(data, {
            where: { id }
        });
    },

    async findByCandidatoAndApertura(
        candidatoId,
        aperturaVacanteId
    ) {
        return await models.Postulacion.findOne({
            where: {
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId
            }
        });
    },

    async countByAperturaVacante(aperturaVacanteId) {
        return await models.Postulacion.count({
            where: {
                aperturaVacante_id: aperturaVacanteId
            }
        });
    },

    async delete(id) {
        return await models.Postulacion.destroy({
            where: { id }
        });
    },
    async findById(id) {
        return await models.Postulacion.findByPk(id);
    },


};