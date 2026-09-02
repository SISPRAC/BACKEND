import { models } from "../database/dbConnection.js";

export const historialConvenioRepository = {

    async create(data, transaction) {

        return await models.HistorialConvenio.create(
            data,
            {
                transaction
            }
        );
    },
};