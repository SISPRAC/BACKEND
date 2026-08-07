import { models } from "../database/dbConnection.js";

export const rolRepository = {

    create: async (data) => {
        return await models.Rol.create(data);
    },

    findByNombre: async (nombre) => {
        return await models.Rol.findOne({ where: { nombre: nombre } });
    },
     getAll: async () => {
        return await models.Rol.findAll();
    }
};