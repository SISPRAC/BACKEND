import { Op } from "../database/sequelizeOperators.js";
import { models } from "../database/dbConnection.js";

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
            where: {
                estado: { [Op.ne]: "CERRADA" }   // ajusta al valor real
            },
            include: [
                { model: models.Vacante },
                { model: models.TutorEmpresa },
                {
                    model: models.Practica,
                    as: "practica",
                    required: true,
                    where: { estado: "EN_CURSO" },
                    include: [{ model: models.Periodo, attributes: ["id", "nombre", "fecha_inicio", "fecha_fin"] }]
                }
            ],
            order: [["id", "DESC"]]
        });

    },


    // ============================================================
    // OBTENER POR ID
    // ============================================================

    async findById(id) {
        return await models.AperturaVacante.findByPk(id, {
            include: [
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
        });
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

    },

    // ============================================================
    // APERTURAS DE UNA EMPRESA
    // ============================================================

    async findByEmpresaId(empresaId) {

        return await models.AperturaVacante.findAll({

            include: [
                {
                    model: models.Vacante,
                    required: true,

                    include: [
                        {
                            model: models.Convenio,
                            required: true,
                            where: { empresa_id: empresaId }
                        }
                    ]
                }
            ],

            order: [["id", "DESC"]]

        });

    },

    async findByPracticaAndEmpresa(practicaId, empresaId) {

        return await models.AperturaVacante.findAll({

            where: { practica_id: practicaId },

            include: [
                {
                    model: models.Vacante,
                    required: true,
                    include: [{
                        model: models.Convenio,
                        required: true,
                        where: { empresa_id: empresaId }
                    }]
                },
                {
                    model: models.TutorEmpresa,
                    required: false, // puede no tener tutor asignado
                    include: [{
                        model: models.User,
                        required: true,
                        attributes: ["nombres", "apellidos"]
                    }]
                }
            ]

        });

    },
    async cerrarPorPractica(practicaId, transaction) {
        const [filas] = await models.AperturaVacante.update(
            { estado: "CERRADA" },
            {
                where: { practica_id: practicaId, estado: { [Op.ne]: "CERRADA" } },
                transaction
            }
        );
        return filas;
    }

};