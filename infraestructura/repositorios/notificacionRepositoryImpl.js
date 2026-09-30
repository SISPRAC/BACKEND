import { models } from "../database/dbConnection.js";

export const notificacionRepository = {

    async create(data, transaction) {
        return await models.Notificacion.create(
            data,
            {
                transaction
            }
        );
    },

    async findById(id) {
        return await models.Notificacion.findByPk(id);
    },

    async findByUsuario(usuarioId) {
        return await models.Notificacion.findAll({
            where: {
                usuario_id: usuarioId
            },
            order: [
                ["fecha_creacion", "DESC"]
            ]
        });
    },

    async findNoLeidasByUsuario(usuarioId) {
        return await models.Notificacion.findAll({
            where: {
                usuario_id: usuarioId,
                estado: "SIN_LEER"
            },
            order: [
                ["fecha_creacion", "DESC"]
            ]
        });
    },

    async marcarLeida(id, transaction) {

        const notificacion =
            await models.Notificacion.findByPk(
                id,
                {
                    transaction
                }
            );

        if (!notificacion) {
            return null;
        }

        await notificacion.update(
            {
                estado: "LEIDA"
            },
            {
                transaction
            }
        );

        return notificacion;
    },

    async marcarTodasLeidas(usuarioId, transaction) {

        await models.Notificacion.update(
            {
                estado: "LEIDA"
            },
            {
                where: {
                    usuario_id: usuarioId,
                    estado: "SIN_LEER"
                },
                transaction
            }
        );

        return true;
    },

    async delete(id, transaction) {

        const notificacion =
            await models.Notificacion.findByPk(
                id,
                {
                    transaction
                }
            );

        if (!notificacion) {
            return null;
        }

        await notificacion.destroy({
            transaction
        });

        return notificacion;
    }
};