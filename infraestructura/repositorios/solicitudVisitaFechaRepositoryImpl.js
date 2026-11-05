import { models } from "../database/dbConnection.js";

export const solicitudVisitaFechaRepository = {

    async create(data, transaction) {

        return await models.SolicitudVisitaFecha.create(
            data,
            { transaction }
        );

    },

    async createMany(data, transaction) {

        return await models.SolicitudVisitaFecha.bulkCreate(
            data,
            { transaction }
        );

    },

    async findBySolicitudVisitaId(solicitudVisitaId) {

        return await models.SolicitudVisitaFecha.findAll({
            where: {
                solicitud_visita_id: solicitudVisitaId
            },
            order: [
                ["fecha_inicio", "ASC"]
            ]
        });

    },

    async findSeleccionada(solicitudVisitaId) {

        return await models.SolicitudVisitaFecha.findOne({
            where: {
                solicitud_visita_id: solicitudVisitaId,
                seleccionada: true
            }
        });

    },

    async findById(id) {

        return await models.SolicitudVisitaFecha.findByPk(id);

    },

    async seleccionar(id, transaction) {

        return await models.SolicitudVisitaFecha.update(
            {
                seleccionada: true
            },
            {
                where: { id },
                transaction
            }
        );

    },

    async deseleccionarTodas(
        solicitudVisitaId,
        transaction
    ) {

        return await models.SolicitudVisitaFecha.update(
            {
                seleccionada: false
            },
            {
                where: {
                    solicitud_visita_id: solicitudVisitaId
                },
                transaction
            }
        );

    },

    async deleteBySolicitudVisitaId(
        solicitudVisitaId,
        transaction
    ) {

        return await models.SolicitudVisitaFecha.destroy({
            where: {
                solicitud_visita_id: solicitudVisitaId
            },
            transaction
        });

    },

    async update(id, data, transaction) {
    return await models.SolicitudVisita.update(
        data,
        {
            where: { id },
            transaction
        }
    );
}

};