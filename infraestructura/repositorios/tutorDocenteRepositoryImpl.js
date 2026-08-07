import { models } from "../database/dbConnection.js";

export const TutorDocenteRepository = {

    async create(data, transaction) {
        return await models.TutorDocente.create(data, { transaction });
    },

    async findByUserId(userId) {
        return await models.TutorDocente.findOne({
            where: { user_id: userId }
        });
    },

    async findByCodigo(codigo) {
        return await models.TutorDocente.findOne({
            where: { codigo }
        });
    },
    async findByAll() {
        return await models.TutorDocente.findAll({
            include: [
                {
                    model: models.User,
                    attributes: ["nombres", "apellidos"]
                }]
        });
    },

}