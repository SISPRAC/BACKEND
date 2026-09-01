import { models } from "../database/dbConnection.js";

export const tutorEmpresaRepository = {

    async create(data, transaction) {
        return await models.TutorEmpresa.create(data, {
            transaction
        });
    },


    async findById(id) {
        return await models.TutorEmpresa.findByPk(id);
    },


    async findByUserId(userId) { 
        return await models.TutorEmpresa.findOne({ where: { usuario_id: userId } }); 
    },


    async findByCodigo(codigo) {
        return await models.TutorEmpresa.findOne({
            where: {
                codigo
            }
        });
    },


    async findByAll() {
        return await models.TutorEmpresa.findAll({
            include: [
                {
                    model: models.User,
                }
            ]
        });
    }

};