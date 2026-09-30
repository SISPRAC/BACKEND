import { models } from "../database/dbConnection.js";

export const visitaRepository = {

    async create(data, transaction) {

        return await models.Visita.create(
            data,
            { transaction }
        );

    },

    async findById(id) {

        return await models.Visita.findByPk(id);

    },

    async findBySolicitudVisitaId(
        solicitudVisitaId
    ) {

        return await models.Visita.findOne({
            where: {
                solicitud_visita_id: solicitudVisitaId
            }
        });

    },

    async update(id, data, transaction) {

        return await models.Visita.update(
            data,
            {
                where: { id },
                transaction
            }
        );

    }

};