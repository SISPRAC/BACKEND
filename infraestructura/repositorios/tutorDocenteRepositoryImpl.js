import { models } from "../database/dbConnection.js";

export const TutorDocenteRepository = {

    async create(data, transaction) {
        return await models.TutorDocente.create(data, { transaction });
    },

    async findByUserId(userId) {
        return await models.TutorDocente.findOne({
            where: { usuario_id: userId }
        });
    },
    async findById(id) {

        return await models.TutorDocente.findByPk(id, {
            include: [
                {
                    model: models.User
                }
            ]
        });

    },

    async findByCodigo(codigo) {
        return await models.TutorDocente.findOne({
            where: { codigo }
        });
    },

    async findByAll() {
        return await models.TutorDocente.findAll({
            include: [
                {
                    model: models.User,
                }
            ]
        });
    },

    async findGruposByPractica(usuarioId, practicaId) {

        const tutorDocente = await models.TutorDocente.findOne({
            where: {
                usuario_id: usuarioId
            },
            attributes: ["id"]
        });

        if (!tutorDocente) {
            return [];
        }

        return await models.Grupo.findAll({

            where: {
                tutorDocente_id: tutorDocente.id,
                practica_id: practicaId
            },

            include: [

                {
                    model: models.Practica,
                    as: "practica",
                    attributes: [
                        "id",
                        "estado",
                        "fecha_inicio",
                        "fecha_fin"
                    ],

                    include: [

                        {
                            model: models.Periodo,
                            attributes: [
                                "id",
                                "nombre"
                            ]
                        }

                    ]
                },

                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",
                    attributes: ["id"]
                }

            ]

        });
    },

    async findGrupoById(grupoId, practicaId) {

        return await models.Grupo.findOne({

            where: {
                id: grupoId,
                practica_id: practicaId
            },

            include: [

                {
                    model: models.Practica,
                    as: "practica",
                    attributes: [
                        "id",
                        "estado",
                        "fecha_inicio",
                        "fecha_fin"
                    ],

                    include: [

                        {
                            model: models.Periodo,
                            attributes: [
                                "id",
                                "nombre"
                            ]
                        }

                    ]
                },

                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",

                    include: [

                        {
                            model: models.Candidato,
                            as: "candidato",

                            include: [

                                {
                                    model: models.User
                                },

                                {
                                    model: models.Practicante,
                                    as: "practicante"
                                }

                            ]
                        }

                    ]
                }

            ]

        });
    },


    async findPostulacionByCandidatoAndPractica(
        candidatoId,
        practicaId
    ) {

        return await models.Postulacion.findOne({

            where: {
                candidato_id: candidatoId
            },

            include: [

                {
                    model: models.AperturaVacante,

                    where: {
                        practica_id: practicaId
                    },

                    include: [

                        {
                            model: models.Vacante,

                            include: [

                                {
                                    model: models.Convenio,

                                    include: [

                                        {
                                            model: models.Empresa
                                        }

                                    ]

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


    async findPracticaPracticanteByPracticanteAndPractica(
        practicanteId,
        practicaId
    ) {

        return await models.PracticaPracticante.findOne({

            where: {
                practicante_id: practicanteId,
                practica_id: practicaId
            }
        });
    }

};