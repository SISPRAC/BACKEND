import { Op } from "sequelize";
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
            }
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
        return await models.Postulacion.findByPk(id);
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
                    attributes: [
                        "id"
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
     async findByCandidatoAndApertura(
        candidatoId,
        aperturaVacanteId
    ) {
        return await models.Postulacion.findOne({
            where: {
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId
            }
        });
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

    async countByAperturaVacante(aperturaVacanteId) {
    return await models.Postulacion.count({
        where: {
            aperturaVacante_id: aperturaVacanteId,
            estado: "ACEPTADO"
        }
    });
}

};