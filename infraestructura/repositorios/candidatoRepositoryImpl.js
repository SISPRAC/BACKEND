import { models } from "../database/dbConnection.js";

export const candidatoRepository = {

    async create(data, transaction) {
        return await models.Candidato.create(data, { transaction });
    },

    async findById(id) {
        return await models.Candidato.findByPk(id);
    },

    async findByUserId(userId) {
        return await models.Candidato.findOne({
            where: { usuario_id: userId }
        });
    },

    async findByCodigo(codigo) {
        return await models.Candidato.findOne({
            where: { codigo }
        });
    },

    async findByAll() {
        return await models.Candidato.findAll({
            include: [
                {
                    model: models.User,
                    attributes: ["nombres", "apellidos"]
                }
            ]
        });
    },

    async getDisponibles() {
        return await models.Candidato.findAll({
            include: [
                {
                    model: models.User,
                    attributes: ["nombres", "apellidos"]
                },
                {
                    model: models.GrupoCandidato,
                    as: "gruposAsignados",
                    required: false,
                    attributes: []
                }
            ],
            where: {
                "$gruposAsignados.id$": null
            }
        });
    },

    async update(id, data, transaction) {

        const candidato = await models.Candidato.findByPk(
            id,
            { transaction }
        );

        if (!candidato) {
            return null;
        }

        return await candidato.update(
            data,
            { transaction }
        );
    },

    async findByPerfil(nombrePerfil) {
        return await models.Candidato.findAll({
            include: [
                {
                    model: models.User,
                    attributes: ["nombres", "apellidos"]
                },
                {
                    model: models.Perfil,
                    where: {
                        nombre: nombrePerfil
                    },
                    through: {
                        attributes: ["calificacion"]
                    }
                }
            ]
        });
    }
};