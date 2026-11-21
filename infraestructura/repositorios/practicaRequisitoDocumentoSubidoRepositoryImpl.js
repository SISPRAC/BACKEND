import { Op } from "../database/sequelizeOperators.js";
import { models } from "../database/dbConnection.js";

export const practicaRequisitoDocumentoSubidoRepository = {

    async create(data, transaction) {
        return await models.PracticaRequisitoDocumentoSubido.create(
            data,
            { transaction }
        );
    },

    async findById(id) {
        return await models.PracticaRequisitoDocumentoSubido.findOne({
            where: { id },
            include: [
                {
                    model: models.User,
                    as: "usuario",
                },
                {
                    model: models.User,
                    as: "usuarioRevision",
                    required: false,
                },
                {
                    model: models.Archivo,
                    as: "archivo",
                },
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                },
            ],
        });
    },

    async findByUsuarioId(usuario_id) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: { usuario_id },
            include: [
                {
                    model: models.Archivo,
                    as: "archivo",
                },
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                },
                {
                    model: models.User,
                    as: "usuarioRevision",
                    required: false,
                },
            ],
            order: [["fecha_subida", "DESC"]],
        });
    },

    async findByRequisitoId(practica_requisito_documento_id) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: { practica_requisito_documento_id },
            include: [
                {
                    model: models.User,
                    as: "usuario",
                },
                {
                    model: models.Archivo,
                    as: "archivo",
                },
                {
                    model: models.User,
                    as: "usuarioRevision",
                    required: false,
                },
            ],
            order: [["fecha_subida", "DESC"]],
        });
    },

    async findByUsuarioYRequisito(
        usuario_id,
        practica_requisito_documento_id
    ) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: {
                usuario_id,
                practica_requisito_documento_id,
            },
            include: [
                {
                    model: models.Archivo,
                    as: "archivo",
                },
            ],
            order: [["fecha_subida", "DESC"]],
        });
    },

    async findByEstado(estado) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: { estado },
            include: [
                {
                    model: models.User,
                    as: "usuario",
                },
                {
                    model: models.Archivo,
                    as: "archivo",
                },
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                },
            ],
            order: [["fecha_subida", "DESC"]],
        });
    },

    async update(id, data, transaction) {
        return await models.PracticaRequisitoDocumentoSubido.update(
            data,
            {
                where: { id },
                transaction,
            }
        );
    },

    async delete(id, transaction) {
        return await models.PracticaRequisitoDocumentoSubido.destroy({
            where: { id },
            transaction,
        });
    },

    async findByUsuarioYPracticaEmpresa(usuario_id, practica_id) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: {
                usuario_id,
            },
            include: [
                {
                    model: models.Archivo,
                    as: "archivo",
                    required: true,
                },
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                    attributes: ["id", "practica_id", "estado"],
                    where: {
                        practica_id,
                        estado: true,
                    },
                    required: true,
                    include: [
                        {
                            model: models.TipoRequisitoDocumento,
                            as: "tipoRequisitoDocumento",
                            attributes: ["id", "nombre"],
                            where: {
                                nombre: {
                                    [Op.notIn]: ["Convenio"],
                                },
                            },
                            required: true,
                            include: [
                                {
                                    model: models.Rol,
                                    as: "rol",
                                    attributes: ["id", "nombre"],
                                    where: {
                                        nombre: "Empresa",
                                    },
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["fecha_subida", "DESC"]],
        });
    },

    async findByUsuarioYPractica(usuario_id, practica_id) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: {
                usuario_id,
            },
            include: [
                {
                    model: models.Archivo,
                    as: "archivo",
                    required: true,
                },
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                    attributes: ["id", "practica_id", "estado"],
                    where: {
                        practica_id,
                        estado: true,
                    },
                    required: true,
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
                                        "Informe Final",
                                    ],
                                },
                            },
                            required: true,
                            include: [
                                {
                                    model: models.Rol,
                                    as: "rol",
                                    attributes: ["id", "nombre"],
                                    where: {
                                        nombre: "Practicante",
                                    },
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
            order: [["fecha_subida", "DESC"]],
        });
    },

    async contarDocumentosPresentadosPorUsuarioYPractica(
        usuario_id,
        practica_id
    ) {
        return await models.PracticaRequisitoDocumentoSubido.findAll({
            where: {
                usuario_id,
            },
            attributes: ["id", "estado"],
            include: [
                {
                    model: models.PracticaRequisitoDocumento,
                    as: "practicaRequisitoDocumento",
                    attributes: ["id", "practica_id"],
                    where: {
                        practica_id,
                        estado: true,
                    },
                    required: true,
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
                                        "Informe Final",
                                    ],
                                },
                            },
                            required: true,
                            include: [
                                {
                                    model: models.Rol,
                                    as: "rol",
                                    attributes: ["id", "nombre"],
                                    where: {
                                        nombre: "Practicante",
                                    },
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    },

    // Documento -> requisito, practicante, candidato y grupos (sin tutor)
    async findByIdParaNotificacion(id) {
        return models.PracticaRequisitoDocumentoSubido.findByPk(id, {
            include: [
                {
                    association: "practicaRequisitoDocumento",
                    include: [
                        { association: "tipoRequisitoDocumento" }
                    ]
                },
                {
                    association: "usuario",
                    include: [
                        {
                            model: models.Candidato,
                            include: [
                                {
                                    association: "gruposAsignados",
                                    include: [
                                        { association: "grupo" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    },

    // Tutor docente con su usuario
    async findTutorDocenteConUsuario(tutorDocenteId) {
        return models.TutorDocente.findByPk(tutorDocenteId, {
            include: [
                { model: models.User }
            ]
        });
    },

    async findByIdParaNotificacionRevision(id) {
        return models.PracticaRequisitoDocumentoSubido.findByPk(id, {
            include: [
                {
                    association: "practicaRequisitoDocumento",
                    include: [
                        { association: "tipoRequisitoDocumento" }
                    ]
                },
                {
                    association: "usuario",
                    attributes: ["id", "nombres", "apellidos", "correo"]
                }
            ]
        });
    }


};