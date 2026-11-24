import { models } from "../database/dbConnection.js";

export const candidatoPerfilRepository = {

    async create(data, transaction) {
        return await models.CandidatoPerfil.create(data, { transaction });
    },
    async deleteByCandidatoId(candidatoId, transaction) {

        return await models.CandidatoPerfil.destroy({
            where: {
                candidato_id: candidatoId
            },
            transaction
        });

    }, async findByCandidatoId(candidatoId) {
        return await models.CandidatoPerfil.findAll({
            where: { candidato_id: candidatoId },
            include: [{ model: models.Perfil }]
        });
    },


}