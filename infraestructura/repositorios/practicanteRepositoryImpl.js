import { models } from "../database/dbConnection.js";

export const PracticanteRepository = {

    async create(data, transaction) {
        return await models.Practicante.create(data, {
            transaction
        });
    },

    async findByCandidatoId(candidatoId, transaction) {
        return await models.Practicante.findOne({
            where: {
                candidato_id: candidatoId
            },
            transaction
        });
    },

    async findByCodigo(codigo) {
        return await models.Practicante.findOne({
            where: {
                codigo
            }
        });
    },

    async findByAll() {
        return await models.Practicante.findAll({
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
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
                }
            ]
        });
    },

    async update(id, data, transaction) {
        return await models.Practicante.update(
            data,
            {
                where: {
                    id
                },
                transaction
            }
        );
    },

    async findMiPractica(usuarioId) {

        // Buscar el practicante a partir del usuario logueado
        const practicante = await models.Practicante.findOne({
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
                    where: {
                        usuario_id: usuarioId
                    }
                }
            ]
        });

        if (!practicante) {
            return null;
        }

        // Buscar la práctica que tiene actualmente EN CURSO
        const practicaPracticante =
            await models.PracticaPracticante.findOne({
                where: {
                    practicante_id: practicante.id,
                    estado: "En curso"
                },
                include: [
                    {
                        model: models.Practica,
                        as: "practica",
                        include: [
                            {
                                model: models.Archivo,
                                as: "archivoArl"
                            }
                        ]
                    }
                ]
            });

        // Buscar la postulación aceptada del candidato
        const postulacion = await models.Postulacion.findOne({
            where: {
                candidato_id: practicante.candidato_id,
                estado: "ACEPTADO"
            },
            include: [
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
                                            include: [
                                                {
                                                    model: models.User
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
                                    model: models.User
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        return {
            practicante,
            practicaPracticante,
            postulacion
        };
    },

    async findByPracticaId(practicaId) {
        return await models.Practicante.findAll({
            include: [
                {
                    model: models.Candidato,
                    as: "candidato",
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
                },
                {
                    model: models.PracticaPracticante,
                    as: "practicas",
                    where: {
                        practica_id: practicaId
                    },
                    required: true
                }
            ]
        });
    },

};