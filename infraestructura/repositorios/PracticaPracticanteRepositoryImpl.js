import { models } from "../database/dbConnection.js";

export const practicaPracticanteRepository = {

    async create(data) {
        return await models.PracticaPracticante.create(data);
    },

    async findAll() {
        return await models.Practicante.findAll({
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
                    include: [
                        {
                            model: models.Usuario,
                            as: "usuario"
                        }
                    ]
                }
            ]
        });
    },

    async findById(id) {
        return await models.Practicante.findByPk(id, {
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
                    include: [
                        {
                            model: models.Usuario,
                            as: "usuario"
                        }
                    ]
                }
            ]
        });
    },

    async findActivaByPracticanteId(practicanteId) {
        return await models.PracticaPracticante.findOne({
            where: {
                practicante_id: practicanteId,
                estado: "En curso"
            }
        });
    },

    async findFinalizadaByPracticanteId(practicanteId) {
        return await models.PracticaPracticante.findOne({
            where: {
                practicante_id: practicanteId,
                estado: "Finalizada"
            }
        });
    },

    async updateEstado(id, estado) {
        const [filasActualizadas] =
            await models.PracticaPracticante.update(
                { estado },
                {
                    where: { id }
                }
            );

        return filasActualizadas > 0;
    }
};