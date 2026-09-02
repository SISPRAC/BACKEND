import { models } from "../database/dbConnection.js";

export const grupoRepository = {

    async create(data) {
        return await models.Grupo.create(data);
    },

    async findAll() {
        return await models.Grupo.findAll({
            include: [
                {
                    model: models.Practica,
                    as: "practica",
                    include: [
                        {
                            model: models.Periodo,
                            as: "Periodo",
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
                    model: models.Practica,
                    as: "practica",
                    include: [
                        {
                            model: models.Periodo,
                            as: "Periodo",
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
                    model: models.TutorDocente,
                    include: [
                        {
                            model: models.User,
                            attributes: ["nombres", "apellidos"]
                        }
                    ]
                },
                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",
                    attributes: ["id", "candidato_id"],
                    include: [
                        {
                            model: models.Candidato,
                            as: "candidato",
                            attributes: ["id", "codigo"],
                            include: [
                                {
                                    model: models.User,
                                    attributes: [
                                        "nombres",
                                        "apellidos"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    },

    async findCandidatosByGrupoId(id) {
        return await models.Grupo.findByPk(id, {
            include: [
                {
                    model: models.Practica,
                    as: "practica",
                    include: [
                        {
                            model: models.Periodo,
                            as: "Periodo",
                            attributes: [
                                "id",
                                "nombre",
                                "fecha_inicio",
                                "fecha_fin"
                            ]
                        }
                    ]
                },

                // =============================
                // TUTOR DOCENTE
                // =============================

                {
                    model: models.TutorDocente,
                    attributes: [
                        "id",
                        "codigo"
                    ],
                    include: [
                        {
                            model: models.User,
                            attributes: [
                                "id",
                                "nombres",
                                "apellidos"
                            ]
                        }
                    ]
                },

                // =============================
                // CANDIDATOS
                // =============================

                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",
                    attributes: [
                        "id",
                        "grupo_id",
                        "candidato_id"
                    ],
                    include: [
                        {
                            model: models.Candidato,
                            as: "candidato",
                            attributes: [
                                "id",
                                "codigo",
                            ],
                            include: [

                                // Datos personales
                                {
                                    model: models.User,
                                    attributes: [
                                        "id",
                                        "nombres",
                                        "apellidos",
                                        "correo",
                                        "telefono",
                                        "cedula"
                                    ]
                                },

                                // Postulación
                                {
                                    model: models.Postulacion,
                                    required: false,
                                    limit: 1,
                                    order: [
                                        ["fecha_postulacion", "DESC"]
                                    ],
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
                                                                    attributes: [
                                                                        "id",
                                                                        "nombre"
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
                        }
                    ]
                }
            ]
        });
    },

    async findByNameAndPractica(nombre, practica_id) {
        return await models.Grupo.findOne({
            where: {
                nombre,
                practica_id
            }
        });
    },

    async tienePracticantes(id) {
        const grupo = await models.Grupo.findByPk(id, {
            include: [
                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",
                    required: true,
                    include: [
                        {
                            model: models.Candidato,
                            as: "candidato",
                            required: true,
                            include: [
                                {
                                    model: models.Practicante,
                                    as: "practicante",
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        return !!grupo;
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