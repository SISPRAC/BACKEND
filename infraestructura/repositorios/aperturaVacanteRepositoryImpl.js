import { models } from "../database/dbConnection.js";
import { Op } from "sequelize";

export const aperturaVacanteRepository = {

    // ============================================================
    // CREAR
    // ============================================================

    async create(data) {

        return await models.AperturaVacante.create(data);

    },


    // ============================================================
    // ACTUALIZAR
    // ============================================================

    async update(id, data) {

        return await models.AperturaVacante.update(
            data,
            {
                where: { id }
            }
        );

    },


    // ============================================================
    // OBTENER TODAS
    // ============================================================

   async findAll() {

    return await models.AperturaVacante.findAll({

        include: [

            {
                model: models.Vacante,
                // Sin as porque la relación no tiene alias
            },

            {
                model: models.TutorEmpresa,
                // Sin as porque la relación no tiene alias
            },

            {
                model: models.Practica,
                as: "practica",

                include: [

                    {
                        model: models.Periodo,
                        attributes: [
                            "id",
                            "nombre",
                            "fecha_inicio",
                            "fecha_fin"
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


    // ============================================================
    // OBTENER POR ID
    // ============================================================

    async findById(id) {

        return await models.AperturaVacante.findByPk(
            id,
            {

                include: [

                    {
                        model: models.Vacante
                    },

                    {
                        model: models.TutorEmpresa
                    },

                    {
                        model: models.Practica,
                        as: "practica",

                        include: [

                            {
                                model: models.Periodo,
                                attributes: [
                                    "id",
                                    "nombre",
                                    "fecha_inicio",
                                    "fecha_fin"
                                ]
                            }

                        ]

                    }

                ]

            }
        );

    },


    // ============================================================
    // BUSCAR APERTURA EXISTENTE
    // ============================================================

    async findByVacanteAndPractica(
        vacante_id,
        practica_id
    ) {

        return await models.AperturaVacante.findOne({

            where: {
                vacante_id,
                practica_id
            }

        });

    },


    // ============================================================
    // CONTAR POSTULACIONES
    // ============================================================

    async countByAperturaVacante(
        aperturaVacanteId
    ) {

        return await models.Postulacion.count({

            where: {

                aperturaVacante_id:
                    aperturaVacanteId,

                estado: {

                    [Op.in]: [
                        "POSTULADO",
                        "ACEPTADO"
                    ]

                }

            }

        });

    },


    // ============================================================
    // ELIMINAR
    // ============================================================

    async delete(id) {

        return await models.AperturaVacante.destroy({

            where: {
                id
            }

        });

    }

};