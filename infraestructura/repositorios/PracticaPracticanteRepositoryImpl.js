import { models } from "../database/dbConnection.js";

export const practicaPracticanteRepository = {

    async create(data, transaction) {
        return await models.PracticaPracticante.create(data, {
            transaction
        });
    },

    async findAll() {
        return await models.Practicante.findAll({
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
                    include: [
                        {
                            model: models.Usuario,
                            as: "usuario"
                        }
                    ]
                }
            ]
        });
    },

    async findById(id) {
        return await models.Practicante.findByPk(id, {
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
                    include: [
                        {
                            model: models.Usuario,
                            as: "usuario"
                        }
                    ]
                }
            ]
        });
    },

    async findActivaByPracticanteId(practicanteId, transaction) {
        return await models.PracticaPracticante.findOne({
            where: {
                practicante_id: practicanteId,
                estado: "En curso"
            },
            transaction
        });
    },

    async findFinalizadaByPracticanteId(practicanteId) {
        return await models.PracticaPracticante.findOne({
            where: {
                practicante_id: practicanteId,
                estado: "Finalizada"
            }
        });
    },

    async updateEstado(id, estado, transaction) {
        const [filasActualizadas] =
            await models.PracticaPracticante.update(
                { estado },
                {
                    where: { id },
                    transaction
                }
            );

        return filasActualizadas > 0;
    },

    async findByIdWithPracticaAndCandidato(id) {
        return await models.PracticaPracticante.findByPk(
            id,
            {
                include: [
                    {
                        model: models.Practica,
                        as: "practica"
                    },
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
                    }
                ]
            }
        );
    },

    async countByPracticaAndEmpresa(practicaId, empresaId) {

        return await models.PracticaPracticante.count({

            distinct: true,
            col: "id",

            where: {
                practica_id: practicaId,
                estado: ["En curso", "Finalizada"]
            },

            include: [{
                model: models.Practicante,
                as: "practicante",
                required: true,

                include: [{
                    model: models.Candidato,
                    as: "candidato",
                    required: true,

                    include: [{
                        model: models.Postulacion,
                        required: true,
                        where: { estado: "ACEPTADO" },

                        include: [{
                            model: models.AperturaVacante,
                            required: true,
                            where: { practica_id: practicaId },

                            include: [{
                                model: models.Vacante,
                                required: true,

                                include: [{
                                    model: models.Convenio,
                                    required: true,
                                    where: { empresa_id: empresaId }
                                }]
                            }]
                        }]
                    }]
                }]
            }]

        });

    },
    // ============================================================
    // POSTULACIONES ACEPTADAS DE UNA EMPRESA EN UNA PRÁCTICA
    // (esto es lo que ata a un practicante con la empresa)
    // ============================================================
    async findPostulacionesAceptadasByPracticaAndEmpresa(practicaId, empresaId) {

        return await models.Postulacion.findAll({

            where: { estado: "ACEPTADO" },

            include: [{
                model: models.AperturaVacante,
                required: true,
                where: { practica_id: practicaId },

                include: [{
                    model: models.Vacante,
                    required: true,

                    include: [{
                        model: models.Convenio,
                        required: true,
                        where: { empresa_id: empresaId }
                    }]
                }]
            }]

        });

    },

    // ============================================================
    // PRACTICANTES DE UNA PRÁCTICA, SOLO DE ESOS CANDIDATOS
    // ============================================================
    async findByPracticaAndCandidatos(practicaId, candidatoIds, estados) {

        return await models.PracticaPracticante.findAll({

            where: {
                practica_id: practicaId,
                estado: estados
            },

            include: [
                {
                    model: models.RetiroPracticante,
                    as: "retiro",
                    required: false,
                    include: [{
                        model: models.Archivo,
                        as: "archivoSoporte",
                        required: false
                    }]
                },
                {
                    model: models.Practicante,
                    as: "practicante",
                    required: true,
                    where: {
                        candidato_id: candidatoIds
                    },

                    include: [{
                        model: models.Candidato,
                        as: "candidato",
                        required: true,

                        include: [{
                            model: models.User,
                            required: true,
                            attributes: [
                                "id",
                                "nombres",
                                "apellidos",
                                "correo",
                                "tipo_documento",
                                "cedula",
                                "telefono"
                            ]
                        }]
                    }]
                }
            ]

        });

    },

    async updateCertificado(id, data, transaction) {
        const [filasActualizadas] = await models.PracticaPracticante.update(
            data,
            { where: { id }, transaction }
        );

        return filasActualizadas > 0;
    },

    async findByIdWithCertificado(id) {
        return await models.PracticaPracticante.findByPk(id, {
            include: [{
                model: models.Archivo,
                as: "certificadoArchivo",
                required: false
            }]
        });
    },

    // Tutor docente del practicante en esa práctica (vía su grupo)
    async findGrupoConTutorByPracticaAndCandidato(practicaId, candidatoId) {
        return await models.Grupo.findOne({
            where: { practica_id: practicaId },
            include: [
                {
                    model: models.GrupoCandidato,
                    as: "candidatosAsignados",
                    required: true,
                    where: { candidato_id: candidatoId }
                },
                {
                    model: models.TutorDocente,
                    required: false,
                    include: [{ model: models.User }]
                }
            ]
        });
    },

    async findByPracticanteIdWithPracticaAndCandidato(practicanteId) {
        return await models.PracticaPracticante.findOne({
            where: { practicante_id: practicanteId },
            order: [["id", "DESC"]],
            include: [
                {
                    model: models.Practica,
                    as: "practica"
                },
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
                }
            ]
        });
    },

    async finalizarActivosPorPractica(practicaId, transaction) {
        const [filas] = await models.PracticaPracticante.update(
            { estado: "Finalizada" },
            { where: { practica_id: practicaId, estado: "En curso" }, transaction }
        );
        return filas;
    }
};