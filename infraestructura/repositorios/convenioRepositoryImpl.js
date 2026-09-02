import { models } from "../database/dbConnection.js";

export const convenioRepository = {

    async create(data, transaction) {
        return await models.Convenio.create(data, {
            transaction
        });
    },

    async findAll() {
        return await models.Convenio.findAll(
            {
                include: [
                    {
                        model: models.Empresa,
                        attributes: ["nombre"]
                    }]
            });
    },

    async findById(id) {

        return await models.Convenio.findByPk(id, {

            include: [

                {
                    model: models.Empresa,
                    attributes: [
                        "id",
                        "nombre"
                    ]
                },


                {
                    model: models.Archivo,
                    attributes: [
                        "id",
                        "nombre",
                        "url"
                    ]
                },


                {
                    model: models.HistorialConvenio,

                    attributes: [
                        "id",
                        "accion",
                        "fecha",
                        "comentario",
                        "archivo_id",
                        "usuario_id"
                    ],

                    include: [

                        {
                            model: models.User,

                            attributes: [
                                "id",
                                "nombres"
                            ],

                            include: [
                                {
                                    model: models.Rol,
                                    attributes: [
                                        "id",
                                        "nombre"
                                    ]
                                }
                            ]
                        },


                        {
                            model: models.Archivo,

                            attributes: [
                                "id",
                                "nombre",
                                "url"
                            ]
                        }

                    ],

                    order: [
                        ["fecha", "DESC"]
                    ]

                }

            ]

        });

    },
    async delete(id) {
        return await models.Convenio.destroy({
            where: { id }
        });
    },
    async update(id, data, transaction) {
        return await models.Convenio.update(
            data,
            {
                where: { id },
                transaction
            }
        );
    },
    async findAllByEmpresaId(empresa_id) {
        return await models.Convenio.findAll({
            where: {
                empresa_id
            },

            include: [
                {
                    model: models.Empresa
                },
                {
                    model: models.Archivo
                },
                {
                    model: models.HistorialConvenio,
                    include: [
                        {
                            model: models.Archivo
                        },
                        {
                            model: models.User,
                            include: [
                                {
                                    model: models.Rol
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
    async findConveniosParaVencer() {

        return await models.Convenio.findAll({
            where: {
                estado: "APROBADO"
            },

            attributes: [
                "id",
                "fecha_fin",
                "estado",
                "archivo_id"
            ]
        });
    },
    async findAprobadoByEmpresaId(empresa_id) {
        return await models.Convenio.findOne({
            where: {
                empresa_id,
                estado: "APROBADO"
            },
            order: [
                ["id", "DESC"]
            ]
        });
    },
};