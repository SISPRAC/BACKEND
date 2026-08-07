import { models } from "../database/dbConnection.js";

export const PracticanteRepository = {

    async create(data, transaction) {
        return await models.Practicante.create(data, { transaction });
    },

    async findByUserId(userId) {
        return await models.Practicante.findOne({
            where: { user_id: userId }
        });
    },

    async findByCodigo(codigo) {
        return await models.Practicante.findOne({
            where: { codigo }
        });
    },
    async findByAll() {
    return await models.Practicante.findAll({
        include: [
            {
                model: models.Candidato,
                as: "candidato",
                include: [
                    {
                       model: models.User,
                        attributes: [
                            "id",
                            "nombres",
                            "apellidos",
                            "correo",
                            "tipo_documento",
                            "cedula",
                            "telefono"
                        ]
                    }
                ]
            }
        ]
    });
},

}