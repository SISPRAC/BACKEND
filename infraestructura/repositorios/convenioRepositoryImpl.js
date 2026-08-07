import { models } from "../database/dbConnection.js";

export const convenioRepository = {

    async create(data) {
        return await models.Convenio.create(data);
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
    async update(id, data) {
        return await models.Convenio.update(data, {
            where: { id }
        });
    }
};