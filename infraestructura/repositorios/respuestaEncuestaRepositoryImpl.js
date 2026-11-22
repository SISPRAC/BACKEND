import { models } from "../database/dbConnection.js";

export const respuestaEncuestaRepository = {

    async create(data) {
        return await models.RespuestaEncuesta.create(data);
    },

    async findByUsuarioPracticaEncuesta(
        usuario_id,
        practica_encuesta_id,
        practicante_id
    ) {
        return await models.RespuestaEncuesta.findOne({
            where: {
                usuario_id,
                practica_encuesta_id,
                practicante_id,
            },
        });
    },

    async findByPracticante(practicante_id) {
        return await models.RespuestaEncuesta.findAll({
            where: {
                practicante_id,
            },
            include: [
                {
                    model: models.PracticaEncuesta,
                    as: "practicaEncuesta",
                },
                {
                    model: models.Practicante,
                    as: "practicante",
                },
            ],
        });
    },

    async findDetalleByPracticanteYEncuesta(
        practicante_id,
        practica_encuesta_id
    ) {
        const resultado = await models.RespuestaEncuesta.findOne({
            where: {
                practicante_id,
                practica_encuesta_id,
            },
            include: [
                {
                    model: models.RespuestaPregunta,
                    include: [
                        {
                            model: models.Pregunta,
                        },
                    ],
                },
            ],
        });
        return resultado;
    },

     // =============================
        // REPORTE: encuestas respondidas de un período
        // (practicante, tutor docente y tutor empresarial / empresa)
        // =============================
        async findAllParaReportePorPeriodo(periodo_id) {
            return await models.RespuestaEncuesta.findAll({
                include: [
                    {
                        // Encuesta asignada a la práctica → filtra por período
                        model: models.PracticaEncuesta,
                        as: "practicaEncuesta",
                        attributes: ["id", "practica_id", "plantilla_encuesta_id"],
                        required: true,
                        include: [
                            {
                                model: models.Practica,
                                as: "practica",
                                attributes: ["id", "periodo_id"],
                                where: { periodo_id },
                                required: true,
                            },
                            {
                                model: models.PlantillaEncuesta,
                                as: "plantilla",
                                attributes: ["id", "titulo", "rol_id"],
                                required: true,
                                include: [
                                    {
                                        model: models.Rol,
                                        attributes: ["id", "nombre"],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        // Practicante evaluado: código y nombre
                        model: models.Practicante,
                        as: "practicante",
                        attributes: ["id", "candidato_id"],
                        required: true,
                        include: [
                            {
                                model: models.Candidato,
                                as: "candidato",
                                attributes: ["id", "codigo", "usuario_id"],
                                required: true,
                                include: [
                                    {
                                        model: models.User,
                                        attributes: [
                                            "id",
                                            "nombres",
                                            "apellidos",
                                            "cedula",
                                        ],
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        // Quien respondió (si es la empresa, trae su registro)
                        model: models.User,
                        as: "usuario",
                        attributes: ["id", "nombres", "apellidos"],
                        required: false,
                        include: [
                            {
                                model: models.Empresa,
                                attributes: ["id", "nombre"],
                                required: false,
                            },
                        ],
                    },
                    {
                        // Preguntas y respuestas
                        model: models.RespuestaPregunta,
                        required: false,
                        include: [
                            {
                                model: models.Pregunta,
                                attributes: ["id", "texto", "tipo", "orden"],
                            },
                        ],
                    },
                ],
                order: [["fecha", "ASC"]],
            });
        },

};
