import { models } from "../database/dbConnection.js";

export const grupoCandidatoRepository = {

    async create(data, transaction) {
        return await models.GrupoCandidato.create(data, { transaction });
    },

    async findById(id) {
        return await models.GrupoCandidato.findByPk(id);
    },

    async findByGrupoAndCandidato(grupo_id, candidato_id) {
        return await models.GrupoCandidato.findOne({
            where: {
                grupo_id,
                candidato_id
            }
        });
    },

    async findByGrupo(grupo_id) {
        return await models.GrupoCandidato.findAll({
            where: {
                grupo_id
            }
        });
    },

    async findByCandidato(candidato_id) {
        return await models.GrupoCandidato.findAll({
            where: {
                candidato_id
            }
        });
    },

    async delete(id) {
        return await models.GrupoCandidato.destroy({
            where: {
                id
            }
        });
    },

    async deleteByGrupoAndCandidato(
        grupo_id,
        candidato_id
    ) {
        return await models.GrupoCandidato.destroy({
            where: {
                grupo_id,
                candidato_id
            }
        });
    },

    async deleteByGrupo(grupo_id) {
        return await models.GrupoCandidato.destroy({
            where: {
                grupo_id
            }
        });
    }
};