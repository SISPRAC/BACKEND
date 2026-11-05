import { models } from "../database/dbConnection.js";

export const visitaRepository = {

    async create(data, transaction) {

        return await models.Visita.create(
            data,
            { transaction }
        );

    },

    async findById(id) {

        return await models.Visita.findByPk(id);

    },

    async update(id, data, transaction) {

        return await models.Visita.update(
            data,
            {
                where: { id },
                transaction
            }
        );

    },

    async findBySolicitudVisitaId(solicitudVisitaId) {

        return await models.Visita.findOne({
            where: {
                solicitud_visita_id: solicitudVisitaId
            },
            include: [
                {
                    model: models.VisitaArchivo,
                    as: "evidencias",
                    include: [
                        {
                            model: models.Archivo,
                            as: "archivo"
                        }
                    ]
                }
            ]
        });

    },

    async findByPracticanteId(practicanteId) {
        return await models.Visita.findAll({
            include: [
                {
                    model: models.SolicitudVisita,
                    as: "solicitud",
                    required: true,
                    include: [
                        {
                            model: models.SolicitudVisitaPracticante,
                            as: "practicantes",
                            required: true,
                            include: [
                                {
                                    model: models.PracticaPracticante,
                                    as: "practicaPracticante",
                                    required: true,
                                    where: {
                                        practicante_id: practicanteId
                                    }
                                }
                            ]
                        },
                        {
                            model: models.Empresa,
                            as: "empresa"
                        },
                        {
                            model: models.TutorDocente,
                            as: "tutorDocente",
                            include: [
                                {
                                    model: models.User
                                }
                            ]
                        }
                    ]
                },
                {
                    model: models.VisitaArchivo,
                    as: "evidencias",
                    include: [
                        {
                            model: models.Archivo,
                            as: "archivo"
                        }
                    ]
                }
            ],
            order: [
                ["id", "DESC"]
            ]
        });
    },

    async findSolicitudVisitaDetails(solicitudVisitaId) {
        return await models.SolicitudVisita.findByPk(
            solicitudVisitaId,
            {
                attributes: [
                    "id",
                    "empresa_id",
                    "tutor_docente_id"
                ],
                include: [
                    // Empresa asociada a la solicitud
                    {
                        model: models.Empresa,
                        as: "empresa",
                        attributes: [
                            "id",
                            "nombre",
                            "logo"
                        ]
                    },

                    // Tutor docente responsable de la solicitud
                    {
                        model: models.TutorDocente,
                        as: "tutorDocente",
                        attributes: [
                            "id",
                            "usuario_id"
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

                    // Practicantes asociados: solo necesitamos su código
                    {
                        model: models.SolicitudVisitaPracticante,
                        as: "practicantes",
                        attributes: [
                            "id",
                            "practica_practicante_id"
                        ],
                        include: [
                            {
                                model: models.PracticaPracticante,
                                as: "practicaPracticante",
                                attributes: [
                                    "id",
                                    "practicante_id"
                                ],
                                include: [
                                    {
                                        model: models.Practicante,
                                        as: "practicante",
                                        attributes: [
                                            "id",
                                            "candidato_id"
                                        ],
                                        include: [
                                            {
                                                model: models.Candidato,
                                                as: "candidato",
                                                attributes: [
                                                    "id",
                                                    "codigo"
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
        );
    },

    async findByIdWithSolicitud(id) {

        return await models.Visita.findByPk(
            id,
            {
                include: [
                    {
                        model: models.SolicitudVisita,
                        as: "solicitud"
                    }
                ]
            }
        );

    },
    async findByIdWithArchivos(id) {

        return await models.Visita.findByPk(
            id,
            {
                include: [
                    {
                        model: models.VisitaArchivo,
                        as: "evidencias",
                        include: [
                            {
                                model: models.Archivo,
                                as: "archivo"
                            }
                        ]
                    }
                ]
            }
        );
    },
};