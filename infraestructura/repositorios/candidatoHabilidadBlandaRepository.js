import { models } from "../database/dbConnection.js";

export const candidatoHabilidadBlandaRepository = {

    async create(data, transaction) {
        return await models.CandidatoHabilidadBlanda.create(data, {
            transaction
        });
    },

    async deleteByCandidatoId(candidatoId, transaction) {
        return await models.CandidatoHabilidadBlanda.destroy({
            where: {
                candidato_id: candidatoId
            },
            transaction
        });
    },

    async findByCandidatoId(candidatoId) {
        return await models.CandidatoHabilidadBlanda.findAll({
            where: {
                candidato_id: candidatoId
            },
            include: [{
                model: models.HabilidadBlanda,
                as: "habilidadBlanda"
            }]
        });
    }
};