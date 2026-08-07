import { models } from "../database/dbConnection.js";

export const historialConvenioRepository = {

    async create(data) {
        return await models.HistorialConvenio.create(data);
    },
};