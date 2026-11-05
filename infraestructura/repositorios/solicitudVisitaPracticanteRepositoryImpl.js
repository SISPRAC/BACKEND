import { models } from "../database/dbConnection.js";

export const solicitudVisitaPracticanteRepository = {

    async create(data, transaction) {

        return await models.SolicitudVisitaPracticante.create(
            data,
            { transaction }
        );

    },

    async createMany(data, transaction) {

        return await models.SolicitudVisitaPracticante.bulkCreate(
            data,
            { transaction }
        );

    },

    async findBySolicitudVisitaId(solicitudVisitaId) {

        return await models.SolicitudVisitaPracticante.findAll({
            where: {
                solicitud_visita_id: solicitudVisitaId
            }
        });

    },

    async findByPracticaPracticanteId(
        practicaPracticanteId
    ) {

        return await models.SolicitudVisitaPracticante.findAll({
            where: {
                practica_practicante_id:
                    practicaPracticanteId
            }
        });

    },

    async deleteBySolicitudVisitaId(
        solicitudVisitaId,
        transaction
    ) {

        return await models.SolicitudVisitaPracticante.destroy({
            where: {
                solicitud_visita_id: solicitudVisitaId
            },
            transaction
        });

    }

};