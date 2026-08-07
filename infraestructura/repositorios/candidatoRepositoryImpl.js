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
            where: {
                grupo_id: null
            },
            include: [
                {
                    model: models.User,
                    attributes: ["nombres", "apellidos"]
                }
            ]
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
    async asignarGrupo(candidatos, grupoId) {
        return await models.Candidato.update(
            { grupo_id: grupoId },
            {
                where: {
                    id: candidatos
                }
            }
        );
    },
    async removerGrupo(grupoId) {
        return await models.Candidato.update(
            {
                grupo_id: null
            },
            {
                where: {
                    grupo_id: grupoId
                }
            }
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
},


};