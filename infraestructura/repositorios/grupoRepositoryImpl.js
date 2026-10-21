import { models } from "../database/dbConnection.js";
import { Op } from "sequelize";

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
                                "codigo"
                            ],
                            include: [

                                // =============================
                                // DATOS PERSONALES
                                // =============================

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

                                // =============================
                                // PRACTICANTE Y SUS PRÁCTICAS
                                // =============================

                                {
                                    model: models.Practicante,
                                    as: "practicante",
                                    required: false,
                                    include: [
                                        {
                                            model: models.PracticaPracticante,
                                            as: "practicas",
                                            required: false,
                                            attributes: [
                                                "id",
                                                "practica_id",
                                                "practicante_id",
                                                "estado"
                                            ]
                                        }
                                    ]
                                },

                                // =============================
                                // POSTULACIÓN
                                // =============================

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

    async findByPracticaId(practica_id) {
        return await models.Grupo.findAll({
            where: {
                practica_id
            },
            attributes: ["id", "nombre"]
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

    async findGrupoDocumentosById(id) {
        return await models.Grupo.findByPk(id, {
            attributes: ["id", "nombre", "practica_id"],
            include: [
                {
                    model: models.Practica,
                    as: "practica",
                    attributes: ["id"],
                    include: [
                        {
                            model: models.PracticaRequisitoDocumento,
                            as: "requisitosDocumentos",
                            attributes: ["id"],
                            where: {
                                estado: true
                            },
                            required: false,
                            include: [
                                {
                                    model: models.TipoRequisitoDocumento,
                                    as: "tipoRequisitoDocumento",
                                    attributes: ["id", "nombre"],
                                    where: {
                                        nombre: {
                                            [Op.notIn]: [
                                                "Plan de Trabajo",
                                                "Informe Parcial",
                                                "Informe Final"
                                            ]
                                        }
                                    },
                                    required: true,
                                    include: [
                                        {
                                            model: models.Rol,
                                            as: "rol",
                                            attributes: ["id", "nombre"],
                                            where: {
                                                nombre: "Practicante"
                                            },
                                            required: true
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

    async findPracticantesDocumentosByGrupoId(id) {
        return await models.GrupoCandidato.findAll({
            where: {
                grupo_id: id
            },
            attributes: ["id", "grupo_id", "candidato_id"],
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
                    attributes: ["id", "codigo"],
                    required: true,
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"],
                            required: true,
                            include: [

                                {
                                    model: models.PracticaRequisitoDocumentoSubido,
                                    as: "documentosRequisitosSubidos",
                                    attributes: [
                                        "id",
                                        "usuario_id",
                                        "practica_requisito_documento_id",
                                        "estado"
                                    ],
                                    required: false,
                                    include: [
                                        {
                                            model: models.Archivo,
                                            as: "archivo",
                                            required: false
                                        },
                                        {
                                            model: models.PracticaRequisitoDocumento,
                                            as: "practicaRequisitoDocumento",
                                            attributes: ["id", "practica_id", "estado"],
                                            required: false
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            model: models.Practicante,
                            as: "practicante",
                            required: true,
                            attributes: ["id"],
                            include: [
                                {
                                    model: models.PracticaPracticante,
                                    as: "practicas",
                                    required: true,
                                    attributes: [
                                        "id",
                                        "practica_id",
                                        "practicante_id",
                                        "estado"
                                    ],
                                    where: {
                                        estado: [
                                            "En curso",
                                            "Finalizada"
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
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