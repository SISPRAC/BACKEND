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
                    attributes: ["id", "nombre"]
                }
            ]
        });

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
                        attributes: [] // Oculta los datos de UserRol
                    },
                    attributes: ["id", "nombre"]
                }
            ]
        });
    },

    findById: async (id) => {
        return await models.User.findByPk(id, {
            include: [
                {
                    model: models.Rol,
                    through: {
                        attributes: [] // Oculta los datos de UserRol
                    },
                    attributes: ["id", "nombre"]
                }
            ]
        });
    },

    delete: async (id) => {
        return await models.User.destroy({ where: { id } });
    },

    findByCedula: async (cedula) => {
        return await models.User.findOne({ where: { cedula } });
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

    updateRoles: async (userId, roles) => {

        const user = await models.User.findByPk(userId);

        if (!user) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado"
            };
        }

        await user.setRoles(roles);

        return await models.User.findByPk(userId, {
            include: [
                {
                    model: models.Rol,
                    through: {
                        attributes: []
                    }
                }
            ]
        });
    },

    findByCorreoEmpresa: async (correo) => {
    return await models.User.findOne({
        where: { correo }
    });
},

};