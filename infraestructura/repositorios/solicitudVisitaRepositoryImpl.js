import { models } from "../database/dbConnection.js";

export const solicitudVisitaRepository = {

    async create(data, transaction) {

        return await models.SolicitudVisita.create(
            data,
            { transaction }
        );

    },

    async findById(id) {

        return await models.SolicitudVisita.findByPk(id);

    },

    async findByIdWithDetails(id) {

        return await models.SolicitudVisita.findByPk(
            id,
            {
                include: [
                    {
                        model: models.Empresa,
                        as: "empresa"
                    },
                    {
                        model: models.TutorDocente,
                        as: "tutorDocente",
                        include: [
                            {
                                model: models.User,
                                as: "Usuario"
                            }
                        ]
                    },
                    {
                        model: models.User,
                        as: "usuarioRespuesta"
                    },
                    {
                        model: models.SolicitudVisitaFecha,
                        as: "fechasPropuestas"
                    },
                    {
                        model: models.Visita,
                        as: "visita"
                    }
                ]
            }
        );

    },
    async findPracticantesWithDetailsBySolicitudId(solicitudVisitaId) {

        return await models.SolicitudVisitaPracticante.findAll({

            where: {
                solicitud_visita_id: solicitudVisitaId
            },

            include: [
                {
                    model: models.PracticaPracticante,
                    as: "practicaPracticante",
                    include: [
                        {
                            model: models.Practicante,
                            as: "practicante",
                            include: [
                                {
                                    model: models.Candidato,
                                    as: "candidato",
                                    include: [
                                        {
                                            model: models.User,
                                            as: "Usuario"
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

    async findByTutorDocente(tutorDocenteId) {

        return await models.SolicitudVisita.findAll({
            where: {
                tutor_docente_id: tutorDocenteId
            },
            order: [
                ["fecha_creacion", "DESC"]
            ]
        });

    },

    async findByEmpresa(empresaId) {

        return await models.SolicitudVisita.findAll({
            where: {
                empresa_id: empresaId
            },
            order: [
                ["fecha_creacion", "DESC"]
            ]
        });

    },

    async updateEstado(
        id,
        estado,
        usuarioRespuestaId,
        observacion,
        fechaRespuesta,
        transaction
    ) {

        return await models.SolicitudVisita.update(
            {
                estado,
                usuario_respuesta_id: usuarioRespuestaId,
                observacion,
                fecha_respuesta: fechaRespuesta
            },
            {
                where: { id },
                transaction
            }
        );

    },

    async actualizarEstado(
        id,
        estado,
        transaction
    ) {
        return await models.SolicitudVisita.update(
            {
                estado
            },
            {
                where: { id },
                transaction
            }
        );
    },

    async findPendientesByEmpresa(empresaId) {

        return await models.SolicitudVisita.findAll({
            where: {
                empresa_id: empresaId,
                estado: "Pendiente"
            },
            order: [
                ["fecha_creacion", "DESC"]
            ]
        });

    },

    async findByTutorDocenteWithDetails(tutorDocenteId) {
        return await models.SolicitudVisita.findAll({
            where: {
                tutor_docente_id: tutorDocenteId
            },

            include: [

                {
                    model: models.Empresa,
                    as: "empresa"
                },

                {
                    model: models.SolicitudVisitaPracticante,
                    as: "practicantes",

                    include: [

                        {
                            model: models.PracticaPracticante,
                            as: "practicaPracticante",

                            include: [

                                {
                                    model: models.Practicante,
                                    as: "practicante",

                                    include: [

                                        {
                                            model: models.Candidato,
                                            as: "candidato",

                                            include: [
                                                {
                                                    model: models.User
                                                }
                                            ]
                                        }

                                    ]
                                },

                                {
                                    model: models.Practica,
                                    as: "practica"
                                }

                            ]
                        }

                    ]
                },

                {
                    model: models.SolicitudVisitaFecha,
                    as: "fechasPropuestas"
                },

                {
                    model: models.Visita,
                    as: "visita",
                    attributes: [
                        "id",
                        "fecha_visita",
                        "hora_visita",
                        "fecha_realizada",
                        "descripcion"
                    ]
                }

            ],

            order: [
                ["fecha_creacion", "DESC"]
            ]
        });
    },

    async cancelar(
        id,
        observacion,
        transaction
    ) {
        return await models.SolicitudVisita.update(
            {
                estado: "Cancelada",
                observacion,
                fecha_respuesta: new Date()
            },
            {
                where: { id },
                transaction
            }
        );
    },

    async findSolicitudesByEmpresaAndPractica(
        empresaId,
        practicaId
    ) {

        return await models.SolicitudVisita.findAll({

            where: {
                empresa_id: empresaId
            },

            attributes: [
                "id",
                "estado",
                "fecha_creacion"
            ],

            include: [

                {
                    model: models.SolicitudVisitaPracticante,
                    as: "practicantes",

                    required: true,

                    attributes: [
                        "id",
                        "practica_practicante_id"
                    ],

                    include: [

                        {
                            model: models.PracticaPracticante,
                            as: "practicaPracticante",

                            required: true,

                            where: {
                                practica_id: practicaId
                            },

                            attributes: [
                                "id",
                                "practicante_id"
                            ]

                        }

                    ]
                },

                {
                    model: models.SolicitudVisitaFecha,
                    as: "fechasPropuestas",
                }

            ],

            order: [
                ["fecha_creacion", "DESC"]
            ]

        });

    },

    async findUsuariosByPracticaPracticanteIds(
        practicaPracticanteIds
    ) {

        return await models.PracticaPracticante.findAll({

            where: {
                id: practicaPracticanteIds
            },

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
                                "usuario_id"
                            ],

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

    async findByIdForGestionar(id) {

        return await models.SolicitudVisita.findByPk(
            id,
            {
                attributes: [
                    "id",
                    "empresa_id",
                    "tutor_docente_id",
                    "usuario_respuesta_id",
                    "estado",
                    "observacion",
                    "fecha_respuesta"
                ],

                include: [

                    {
                        model: models.Empresa,
                        as: "empresa",

                        attributes: [
                            "id",
                            "nit",
                            "nombre",
                            "direccion",
                            "logo"
                        ],

                        include: [
                            {
                                model: models.TutorEmpresa,

                                attributes: [
                                    "id",
                                    "usuario_id",
                                    "empresa_id",
                                    "cargo"
                                ],

                                include: [
                                    {
                                        model: models.User,
                                        as: "Usuario",

                                        attributes: [
                                            "id",
                                            "nombres",
                                            "apellidos"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        model: models.Visita,
                        as: "visita",

                        attributes: [
                            "id",
                            "solicitud_visita_id",
                            "fecha_visita",
                            "hora_visita",
                            "fecha_realizada",
                            "descripcion"
                        ]
                    }
                ]
            }
        );
    },

    async findPracticantesBySolicitudId(solicitudVisitaId) {

        return await models.SolicitudVisitaPracticante.findAll({

            where: {
                solicitud_visita_id: solicitudVisitaId
            },

            attributes: [
                "id",
                "solicitud_visita_id",
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
                                        "codigo",
                                        "usuario_id"
                                    ],

                                    include: [
                                        {
                                            model: models.User,
                                            as: "Usuario",

                                            attributes: [
                                                "id",
                                                "nombres",
                                                "apellidos"
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
};