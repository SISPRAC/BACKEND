import { models } from "../database/dbConnection.js";

export const candidatoIdiomaRepository = {

    async create(data, transaction) {
        return await models.CandidatoIdioma.create(data, {
            transaction
        });
    },

    async deleteByCandidatoId(candidatoId, transaction) {
        return await models.CandidatoIdioma.destroy({
            where: {
                candidato_id: candidatoId
            },
            transaction
        });
    },

    async findByCandidatoId(candidatoId) {
        return await models.CandidatoIdioma.findAll({
            where: {
                candidato_id: candidatoId
            },
            include: [{
                model: models.Idioma,
                as: "idioma"
            }]
        });
    }
};