import { Op } from "../database/sequelizeOperators.js";

import { models } from "../database/dbConnection.js";

export const postulacionRepository = {


    async create(data) {
        return await models.Postulacion.create(data);
    },

    async update(id, data, transaction) {

        return await models.Postulacion.update(
            data,
            {
                where: { id },
                transaction
            }
        );
    },
    async findByCandidatoAndApertura(
        candidatoId,
        aperturaVacanteId
    ) {
        return await models.Postulacion.findOne({
            where: {
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId
            },
            include: [
                {
                    model: models.Candidato,
                    attributes: ["id", "codigo"],
                    include: [
                        {
                            model: models.User,
                            attributes: [
                                "id",
                                "nombres",
                                "apellidos",
                                "correo"
                            ]
                        }
                    ]
                },
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
                                            ],
                                            include: [
                                                {
                                                    model: models.User,
                                                    attributes: [
                                                        "id",
                                                        "correo"
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

    async countByAperturaVacante(aperturaVacanteId) {
        return await models.Postulacion.count({
            where: {
                aperturaVacante_id: aperturaVacanteId,
                estado: {
                    [Op.in]: ["POSTULADO", "ACEPTADO"]
                }
            }
        });
    },

    async delete(id) {
        return await models.Postulacion.destroy({
            where: { id }
        });
    },


    async findById(id) {
        return await models.Postulacion.findByPk(id, {
            include: [
                {
                    model: models.Candidato,
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
                                "apellidos",
                                "correo"
                            ]
                        }
                    ]
                },
                {
                    model: models.AperturaVacante,
                    required: true,
                    include: [
                        {
                            model: models.Vacante,
                            required: true,
                            include: [
                                {
                                    model: models.Convenio,
                                    required: true,
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
        });
    },


    async findByEmpresa(empresaId) {

        return await models.Postulacion.findAll({

            include: [

                {
                    model: models.Candidato,

                    attributes: [
                        "id",
                        "codigo",
                        "hoja_vida_archivo_id"
                    ],

                    include: [

                        {
                            model: models.User
                            // Sin attributes => trae todos los campos de User
                        },

                        {
                            model: models.Archivo,
                            as: "hojaVida",

                            attributes: [
                                "id",
                                "nombre",
                                "url",
                                "public_id",
                                "resource_type",
                                "fecha_subida"
                            ]
                        }

                    ]
                },

                {
                    model: models.AperturaVacante,
                    required: true,

                    include: [

                        {
                            model: models.Vacante,
                            required: true,

                            include: [

                                {
                                    model: models.Convenio,
                                    required: true,

                                    where: {
                                        empresa_id: empresaId
                                    }
                                }

                            ]
                        }

                    ]
                }

            ]

        });
    },
    async findByIdParaAceptar(id, transaction) {
        return await models.Postulacion.findByPk(id, {
            include: [
                {
                    model: models.Candidato,
                    attributes: ["id", "codigo"],
                    include: [
                        {
                            model: models.User,
                            attributes: ["id", "nombres", "apellidos", "correo"]
                        }
                    ]
                },
                {
                    model: models.AperturaVacante,
                    required: true,
                    include: [
                        {
                            model: models.Practica,
                            as: "practica",
                            required: true,
                            attributes: [
                                "id",
                                "fecha_inicio",
                                "fecha_fin",
                                "periodo_id"
                            ]
                        },
                        {
                            model: models.Vacante,
                            include: [
                                {
                                    model: models.Convenio,
                                    include: [
                                        {
                                            model: models.Empresa,
                                            include: [
                                                {
                                                    model: models.User,
                                                    attributes: [
                                                        "id",
                                                        "nombres",
                                                        "apellidos",
                                                        "correo"
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: models.TutorEmpresa,
                            include: [
                                {
                                    model: models.User,
                                    attributes: [
                                        "id",
                                        "nombres",
                                        "apellidos",
                                        "correo",
                                        "telefono"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            transaction
        });
    },

    async findIdsConPostulacionActiva() {

        const postulaciones =
            await models.Postulacion.findAll({

                where: {
                    estado: {
                        [Op.in]: [
                            "POSTULADO",
                            "ACEPTADO"
                        ]
                    }
                },

                attributes: [
                    "candidato_id"
                ],

                raw: true

            });

        return postulaciones.map(
            (postulacion) =>
                postulacion.candidato_id
        );
    },

    async findPostulacionActivaByCandidato(candidatoId) {
        return await models.Postulacion.findOne({
            where: {
                candidato_id: candidatoId,
                estado: {
                    [Op.in]: ["POSTULADO", "ACEPTADO"]
                }
            }
        });
    },

    // Inserta varias postulaciones en UN solo INSERT (atómico: o entran todas o ninguna)
    async createMany(rows, transaction) {
        return await models.Postulacion.bulkCreate(rows, {
            returning: true,
            transaction
        });
    },

    // Devuelve los candidato_id (de la lista) que ya tienen una postulación activa
    async findActivasByCandidatos(candidatosIds) {
        const filas = await models.Postulacion.findAll({
            where: {
                candidato_id: { [Op.in]: candidatosIds },
                estado: { [Op.in]: ["POSTULADO", "ACEPTADO"] }
            },
            attributes: ["candidato_id"],
            raw: true
        });
        return filas.map((f) => Number(f.candidato_id));
    },

    async countByAperturaVacanteAceptado(aperturaVacanteId) {
        return await models.Postulacion.count({
            where: {
                aperturaVacante_id: aperturaVacanteId,
                estado: "ACEPTADO"
            }
        });
    },

    async findAceptadaByCandidatoYPractica(
    candidatoId,
    practicaId
) {
    return await models.Postulacion.findOne({
        where: {
            candidato_id: candidatoId,
            estado: "ACEPTADO"
        },
        include: [
            {
                model: models.AperturaVacante,
                where: {
                    practica_id: practicaId
                },
                include: [
                    {
                        model: models.TutorEmpresa,
                        include: [
                            {
                                model: models.User
                            },
                            {
                                model: models.Empresa,
                                attributes: ["id", "nombre","usuario_id" ]
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

};