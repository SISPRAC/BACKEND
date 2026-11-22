import { Op } from "../database/sequelizeOperators.js";
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

                // TUTOR DOCENTE
                {
                    model: models.TutorDocente,
                    attributes: ["id", "codigo"],
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos"]
                        }
                    ]
                },

                // CANDIDATOS ASIGNADOS
                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",
                    attributes: ["id", "grupo_id", "candidato_id"],
                    include: [
                        {
                            model: models.Candidato,
                            as: "candidato",
                            required: true,
                            attributes: ["id", "codigo"],
                            include: [
                                // DATOS PERSONALES DEL CANDIDATO
                                {
                                    model: models.User,
                                    required: true,
                                    attributes: [
                                        "id",
                                        "nombres",
                                        "apellidos",
                                        "correo",
                                        "telefono",
                                        "cedula"
                                    ]
                                },

                                // PRACTICANTE: OPCIONAL
                                {
                                    model: models.Practicante,
                                    as: "practicante",
                                    required: false,
                                    attributes: ["id"]
                                },

                                // ÚLTIMA POSTULACIÓN
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
                                                                    attributes: ["id", "nombre"]
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


    async findPracticaPracticantesByPracticaAndCandidatos(
        practicaId,
        candidatoIds
    ) {
        if (!practicaId || !candidatoIds?.length) {
            return [];
        }

        return await models.PracticaPracticante.findAll({
            where: {
                practica_id: practicaId
            },
            attributes: [
                "id",
                "practica_id",
                "practicante_id",
                "estado",
                "certificado_archivo_id",
                "certificado_subido_por",
                "certificado_fecha_subida"
            ],
            include: [
                {
                    model: models.RetiroPracticante,
                    as: "retiro",
                    required: false,
                    include: [
                        {
                            model: models.Archivo,
                            as: "archivoSoporte",
                            required: false
                        }
                    ]
                },
                {
                    model: models.Archivo,
                    as: "certificadoArchivo",
                    required: false
                },
                {
                    model: models.Practicante,
                    as: "practicante",
                    required: true,
                    attributes: ["id", "candidato_id"],
                    where: {
                        candidato_id: {
                            [Op.in]: candidatoIds
                        }
                    }
                }
            ],
            logging: console.log
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
        const total = await models.GrupoCandidato.count({
            where: { grupo_id: id },
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
        });

        return total > 0;
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
    },

    async obtenerGruposParaReportePorPeriodo(periodo_id) {
        return await models.Grupo.findAll({
            attributes: ["id", "nombre"],
            include: [
                {
                    model: models.Practica,
                    as: "practica",
                    where: { periodo_id },
                    attributes: ["id", "periodo_id", "estado"],
                    required: true
                },
                {
                    model: models.TutorDocente,
                    attributes: ["id", "codigo"],
                    include: [
                        {
                            model: models.User,
                            attributes: ["nombres", "apellidos"]
                        }
                    ]
                },
                {
                    model: models.Candidato,
                    as: "Candidatos",
                    attributes: ["id", "codigo"],          // <- confirma que "codigo" está en Candidato
                    through: { attributes: [] },           // no traer columnas de GrupoCandidato
                    required: false,                       // grupos sin practicantes también salen
                    include: [
                        {
                            model: models.User,
                            attributes: ["nombres", "apellidos", "correo"]  // <- confirma "correo"
                        }
                    ]
                }
            ],
            order: [
                ["nombre", "ASC"],
                [{ model: models.Candidato, as: "Candidatos" }, models.User, "apellidos", "ASC"]
            ]
        });
    }
};