import { models } from "../database/dbConnection.js";

export const grupoRepository = {

    async create(data) {
        return await models.Grupo.create(data);
    },

    async findAll() {
        return await models.Grupo.findAll({
            include: [
                {
                    model: models.Periodo,
                    attributes: ["nombre"]
                },
                {
                    model: models.TutorDocente,
                    attributes: ["codigo"],
                    include: [
                        {
                            model: models.User,
                            attributes: ["nombres", "apellidos"]
                        }
                    ]
                }
            ]
        });
    },

    async findById(id) {
        return await models.Grupo.findByPk(id, {
        include: [
            {
                model: models.Periodo,
                attributes: ["nombre"]
            },
            {
                model: models.TutorDocente,
                include: [
                    {
                        model: models.User,
                        attributes: ["nombres", "apellidos"]
                    }
                ]
            },
            {
                model: models.Candidato,
                attributes: ["id", "codigo"],
                include: [
                    {
                        model: models.User,
                        attributes: ["nombres", "apellidos"],
                    }
                ]
            }
        ]
    });
    },

    async findCandidatosByGrupoId(id){
        return await models.Grupo.findByPk(id, {
        include: [
            {
                model: models.Periodo,
                attributes: ["nombre"]
            },
            {
                model: models.TutorDocente,
                include: [
                    {
                        model: models.User,
                        attributes: ["nombres", "apellidos"]
                    }
                ]
            },
            {
                model: models.Candidato,
                attributes: ["id", "codigo"],
                include: [
                    {
                        model: models.User,
                        attributes: ["nombres", "apellidos"],
                    },
                    {
                        model: models.Postulacion,
                        required: false,
                        limit: 1,
                        order: [["fecha_postulacion", "DESC"]],
                        include: [
                            {
                                model: models.AperturaVacante,
                                include: [
                                    {
                                        model: models.Vacante,
                                        include: [
                                            {
                                                model: models.Convenio,
                                                include: [
                                                    {
                                                        model: models.Empresa,
                                                        attributes: ["nombre"]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
    },

    async findByName(nombre) {
        return await models.Grupo.findOne({
            where: { nombre }
        });
    },

    async delete(id) {
        return await models.Grupo.destroy({
            where: { id }
        });
    },

    async update(id, data) {
        return await models.Grupo.update(data, {
            where: { id }
        });
    }
};