import { models } from "../database/dbConnection.js";

export const archivoRepository = {

    async create(data, transaction) {
        return await models.Archivo.create(data, {
            transaction
        });
    },

    async findById(id) {
        return await models.Archivo.findByPk(id);
    },

    async findAll() {
        return await models.Archivo.findAll({
            order: [["fecha_subida", "DESC"]]
        });
    },

    async update(id, data, transaction) {

        const archivo =
            await models.Archivo.findByPk(
                id,
                { transaction }
            );

        if (!archivo) {
            return null;
        }

        await archivo.update(
            data,
            { transaction }
        );

        return archivo;

    },

    async delete(id, transaction) {

        const archivo =
            await models.Archivo.findByPk(
                id,
                { transaction }
            );

        if (!archivo) {
            return null;
        }

        await archivo.destroy({
            transaction
        });

        return archivo;
    },

    async tieneReferencias(id, transaction) {

        const tipoRequisitoDocumento =
            await models.TipoRequisitoDocumento.count({
                where: {
                    archivo_id: id
                },
                transaction
            });

        const tipoInforme =
            await models.TipoInforme.count({
                where: {
                    archivo_id: id
                },
                transaction
            });

        const entregaInforme =
            await models.EntregaInforme.count({
                where: {
                    archivo_id: id
                },
                transaction
            });

        return (
            tipoRequisitoDocumento > 0 ||
            tipoInforme > 0 ||
            entregaInforme > 0
        );
    }
};