import { models } from "../database/dbConnection.js";

export const retiroPracticanteRepository = {

    async create(data) {
        return await models.RetiroPracticante.create(data);
    },

    async findAll() {
        return await models.RetiroPracticante.findAll({
            include: [
                {
                    model: models.User,
                    as: "usuario",
                    attributes: ["id", "nombres", "apellidos"],
                    include: [
                        {
                            model: models.Rol,
                            attributes: ["id", "nombre"],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                },
                {
                    model: models.Practicante,
                    as: "practicante"
                },
                {
                    model: models.Archivo,
                    as: "archivoSoporte"
                }
            ],
            order: [["fecha_retiro", "DESC"]]
        });
    },

    async findById(id) {
        return await models.RetiroPracticante.findByPk(id, {
            include: [
                {
                    model: models.User,
                    as: "usuario"
                },
                {
                    model: models.Practicante,
                    as: "practicante"
                },
                {
                    model: models.Archivo,
                    as: "archivoSoporte"
                }
            ]
        });
    },

    async findByPracticanteId(practicanteId) {
        return await models.RetiroPracticante.findAll({
            where: {
                practicante_id: practicanteId
            },
            order: [["fecha_retiro", "DESC"]]
        });
    },

    async delete(id) {
        return await models.RetiroPracticante.destroy({
            where: {
                id
            }
        });
    }
};