import { Op } from "../database/sequelizeOperators.js";
import { models, sequelize } from "../database/dbConnection.js";

// Fecha de hoy en Colombia (YYYY-MM-DD), comparable con DATEONLY
const hoyColombia = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
export const practicaRepository = {

    async create(data, transaction) {
        return await models.Practica.create(data, { transaction });
    },


    async findById(id) {
        return await models.Practica.findOne({
            where: { id },
            include: [
                {
                    model: models.Periodo,
                    attributes: ["id", "nombre"]
                }
            ]
        });
    },


    async findByIdConPeriodo(id) {
        return await models.Practica.findByPk(id, {
            include: [
                { model: models.Periodo, required: true }
            ]
        });
    },

    async findByPeriodoId(periodo_id) {
        return await models.Practica.findOne({
            where: { periodo_id }
        });
    },

    async findByAll() {
        return await models.Practica.findAll({
            include: [
                {
                    model: models.Periodo,
                    attributes: [
                        "id",
                        "nombre",
                        "fecha_inicio",
                        "fecha_fin"
                    ]
                },
                {
                    model: models.Archivo,
                    as: "archivoArl"
                }
            ]
        });
    },

    async update(id, data, transaction) {
        return await models.Practica.update(
            data,
            {
                where: { id },
                transaction
            }
        );
    },

    async delete(id, transaction) {
        return await models.Practica.destroy({
            where: { id },
            transaction
        });
    },

    async findRequisitosDocumentosEmpresa(practica_id) {
        return await models.PracticaRequisitoDocumento.findAll({
            where: {
                practica_id,
                estado: true,
            },
            attributes: ["id", "practica_id", "tipo_requisito_documento_id"],
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
        });
    },

    // ============================================================
    // TODAS LAS PRÁCTICAS CON SU PERIODO
    // ============================================================

    async findAllConPeriodo() {

        return await models.Practica.findAll({

            include: [
                {
                    model: models.Periodo,
                    required: true
                }
            ],

            // where: { estado: "ACTIVA" },  // ajusta si solo quieres las vigentes

            order: [[models.Periodo, "nombre", "DESC"]]

        });

    },

    async tienePracticaPracticantes(practica_id) {
        return await models.PracticaPracticante.count({
            where: {
                practica_id
            }
        });
    },

    async tieneGrupos(practica_id) {
        return await models.Grupo.count({
            where: {
                practica_id
            }
        });
    },

    async obtenerVencidasActivas() {
        return models.Practica.findAll({
            where: {
                estado: "EN_CURSO",
                fecha_fin: { [Op.lt]: hoyColombia() }
            },
            include: [
                { model: models.Periodo },
                {
                    model: models.AperturaVacante,
                    as: "aperturasVacante",
                    required: false,
                    include: [{
                        model: models.Vacante,
                        include: [{
                            model: models.Convenio,
                            include: [{
                                model: models.Empresa,
                                include: [{
                                    model: models.User,
                                    attributes: ["id", "correo", "nombres", "apellidos"]
                                }]
                            }]
                        }]
                    }]
                }
            ]
        });
    },

    // Devuelve cuántas filas cambió (0 = otro proceso ya la finalizó)
    async marcarFinalizada(practicaId, transaction) {
        const [filas] = await models.Practica.update(
            { estado: "FINALIZADA" },
            { where: { id: practicaId, estado: "EN_CURSO" }, transaction }
        );
        return filas;
    },

    async transaccion(callback) {
        return sequelize.transaction(callback);
    }

};