import { models } from "../database/dbConnection.js";

export const empresaRepository = {

    async create(data, transaction) {
        return await models.Empresa.create(data, {
            transaction
        });
    },

    async findById(id) {
        return await models.Empresa.findByPk(id);
    },

    async findByUserId(userId) {

        return await models.Empresa.findOne({
            where: {
                usuario_id: userId
            },

            include: [
                {
                    model: models.User,
                    attributes: [
                        "id",
                        "nombres",
                        "apellidos",
                        "correo",
                        "tipo_documento",
                        "cedula",
                        "telefono"
                    ]
                }
            ]
        });
    },

    async findByNit(nit) {
        return await models.Empresa.findOne({
            where: { nit }
        });
    },

    update: async (id, data, transaction) => {

        const empresa = await models.Empresa.findByPk(
            id,
            { transaction }
        );

        if (!empresa) {
            return null;
        }

        return await empresa.update(
            data,
            { transaction }
        );
    },

    async findAllConDocumentosPorPractica(practica_id) {
        const { Op } = await import("sequelize");

        const empresas = await models.Empresa.findAll({
            attributes: ["id", "nombre", "nit", "usuario_id"],
            order: [["nombre", "ASC"]],
        });

        const usuariosIds = empresas.map((empresa) => empresa.usuario_id);

        if (usuariosIds.length === 0) {
            return [];
        }

        const documentos = await models.PracticaRequisitoDocumentoSubido.findAll({
            attributes: [
                "id",
                "usuario_id",
                "practica_requisito_documento_id",
                "estado",
                "fecha_subida",
            ],
            where: {
                usuario_id: {
                    [Op.in]: usuariosIds,
                },
            },
            include: [
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
        });

        const documentosPorUsuario = new Map();

        for (const documento of documentos) {
            const usuarioId = documento.usuario_id;

            if (!documentosPorUsuario.has(usuarioId)) {
                documentosPorUsuario.set(usuarioId, []);
            }

            documentosPorUsuario.get(usuarioId).push(documento);
        }

        return empresas.map((empresa) => {
            const datos = empresa.toJSON();

            return {
                ...datos,
                User: {
                    id: datos.usuario_id,
                    documentosRequisitosSubidos:
                        documentosPorUsuario.get(datos.usuario_id) ?? [],
                },
            };
        });
    },
};