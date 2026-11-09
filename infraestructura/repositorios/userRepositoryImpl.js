
import { models } from "../database/dbConnection.js";

export const userRepository = {

    findBycorreo: async (correo) => {

        return await models.User.findOne({
            where: { correo },
            include: [
                {
                    model: models.Rol,
                    attributes: ["id", "nombre"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.Empresa,
                    attributes: ["id", "nombre", "es_publica"]
                }
            ]
        });

    },

    updateGoogleId: async (id, google_id) => {
        return await models.User.update(
            { google_id },
            { where: { id } }
        );
    },

    create: async (data, transaction) => {
        return await models.User.create(data, { transaction });
    },

    findAll: async () => {
        return await models.User.findAll({
            include: [
                {
                    model: models.Rol,
                    through: {
                        attributes: []
                    },
                    attributes: ["id", "nombre"]
                }
            ]
        });
    },

    findById: async (id, transaction) => {
        return await models.User.findByPk(id, {
            transaction,
            include: [
                {
                    model: models.Rol,
                    through: {
                        attributes: []
                    },
                    attributes: ["id", "nombre"]
                }
            ]
        });
    },

    delete: async (id) => {
        return await models.User.destroy({
            where: { id }
        });
    },

    findByCedula: async (cedula) => {
        return await models.User.findOne({
            where: { cedula }
        });
    },

    update: async (id, data, transaction) => {

        const user = await models.User.findByPk(
            id,
            { transaction }
        );

        if (!user) {
            return null;
        }

        return await user.update(
            data,
            { transaction }
        );
    },

    // ==========================================
    // ACTUALIZAR ROLES
    // ==========================================

    updateRoles: async (userId, roles, transaction = null) => {

        const user = await models.User.findByPk(userId, {
            transaction
        });

        if (!user) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado"
            };
        }

        await user.setRoles(roles, {
            transaction
        });

        return await models.User.findByPk(userId, {
            transaction,
            include: [
                {
                    model: models.Rol,
                    through: {
                        attributes: []
                    },
                    attributes: ["id", "nombre"]
                }
            ]
        });
    },

    findByCorreoEmpresa: async (correo) => {
        return await models.User.findOne({
            where: { correo }
        });
    },

    async findUsuariosPorRol(nombreRol) {
        return await models.User.findAll({
            attributes: [
                "id",
                "nombres",
                "apellidos",
                "correo"
            ],
            include: [
                {
                    model: models.Rol,
                    attributes: [],
                    where: {
                        nombre: nombreRol
                    },
                    through: {
                        attributes: []
                    },
                    required: true
                }
            ]
        });
    },

    async updatePassword(userId, passwordHash) {
        return models.User.update(
            { password: passwordHash },
            { where: { id: userId } }
        );
    }

};
