import { models } from "../database/dbConnection.js";

export const vacanteRepository = {

    async create(data, transaction) {
        return await models.Vacante.create(data, {
            transaction
        });
    },

    async findAll() {
        return await models.Vacante.findAll({
            include: [
                {
                    model: models.Convenio,
                    include: [
                        {
                            model: models.Empresa
                        }
                    ]
                },
                {
                    model: models.Perfil,
                    through: {
                        attributes: ["nivel_minimo"]
                    }
                }
            ]
        });
    },

    async findById(id) {

        return await models.Vacante.findByPk(id, {

            include: [
                {
                    model: models.Convenio,
                    attributes: [
                        "id",
                        "empresa_id",
                        "estado"
                    ]
                }
            ]

        });

    },

    async findByEmpresa(empresaId) {
        return await models.Vacante.findAll({
            include: [
                {
                    model: models.Convenio,
                    where: {
                        empresa_id: empresaId
                    },
                    include: [
                        {
                            model: models.Empresa
                        }
                    ]
                },
                {
                    model: models.Perfil,
                    through: {
                        attributes: ["nivel_minimo"]
                    }
                },
                {
                    model: models.AperturaVacante,
                    include: [
                        {
                            model: models.TutorEmpresa,
                            include: [
                                {
                                    model: models.User
                                }
                            ]
                        },
                        {
                            model: models.Practica,
                            as: "practica",
                            include: [
                                {
                                    model: models.Periodo
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    },

    async findAperturas() {

        return await models.AperturaVacante.findAll({

            include: [
                {
                    model: models.Vacante,

                    include: [
                        {
                            model: models.Convenio,

                            where: {
                                estado: "APROBADO"
                            },

                            include: [
                                {
                                    model: models.Empresa
                                }
                            ]
                        },

                        {
                            model: models.Perfil,
                            through: {
                                attributes: ["nivel_minimo"]
                            }
                        }
                    ]
                },

                {
                    model: models.TutorEmpresa,

                    include: [
                        {
                            model: models.User
                        }
                    ]
                },

                {
                    model: models.Practica,
                    as: "practica",

                    include: [
                        {
                            model: models.Periodo,
                            attributes: [
                                "id",
                                "nombre",
                                "fecha_inicio",
                                "fecha_fin"
                            ]
                        }
                    ]
                },

                {
                    model: models.HistorialAperturaVacante,
                    as: "historialCupos"
                },

                {
                    model: models.Postulacion,

                    include: [
                        {
                            model: models.Candidato,

                            include: [
                                {
                                    model: models.User
                                },

                                {
                                    model: models.Perfil,
                                    through: {
                                        attributes: ["calificacion"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],

            order: [
                ["id", "DESC"]
            ]

        });

    },

    async update(id, data, transaction) {
        await models.Vacante.update(
            data,
            {
                where: { id },
                transaction
            }
        );

        return await this.findById(id);
    },

    async existsAperturas(id) {
        const cantidad = await models.AperturaVacante.count({
            where: {
                vacante_id: id
            }
        });

        return cantidad > 0;
    },

    async findByIdAndEmpresa(id, empresaId) {
        return await models.Vacante.findOne({
            where: {
                id
            },
            include: [
                {
                    model: models.Convenio,
                    where: {
                        empresa_id: empresaId
                    }
                }
            ]
        });
    },

    async delete(id) {
    return await models.Vacante.destroy({
        where: { id }
    });
},
};