import { models } from "../database/dbConnection.js";

export const practicaPracticanteRepository = {

    async create(data, transaction) {
        return await models.PracticaPracticante.create(data, {
            transaction
        });
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

    async findActivaByPracticanteId(practicanteId, transaction) {
        return await models.PracticaPracticante.findOne({
            where: {
                practicante_id: practicanteId,
                estado: "En curso"
            },
            transaction
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
    },

    async findByIdWithPracticaAndCandidato(id) {
        return await models.PracticaPracticante.findByPk(
            id,
            {
                include: [
                    {
                        model: models.Practica,
                        as: "practica"
                    },
                    {
                        model: models.Practicante,
                        as: "practicante",
                        include: [
                            {
                                model: models.Candidato,
                                as: "candidato",
                                include: [
                                    {
                                        model: models.User
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    }
};