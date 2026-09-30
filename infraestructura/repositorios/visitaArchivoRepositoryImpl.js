import { models } from "../database/dbConnection.js";

export const visitaArchivoRepository = {

    async create(data, transaction) {

        return await models.VisitaArchivo.create(
            data,
            { transaction }
        );

    },

    async createMany(data, transaction) {

        return await models.VisitaArchivo.bulkCreate(
            data,
            { transaction }
        );

    },

    async findByVisitaId(visitaId) {

        return await models.VisitaArchivo.findAll({
            where: {
                visita_id: visitaId
            }
        });

    },

    async findById(id) {

        return await models.VisitaArchivo.findByPk(id);

    },

    async deleteByVisitaId(
        visitaId,
        transaction
    ) {

        return await models.VisitaArchivo.destroy({
            where: {
                visita_id: visitaId
            },
            transaction
        });

    }

};