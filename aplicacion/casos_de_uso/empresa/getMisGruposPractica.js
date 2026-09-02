import { models } from "../../../infraestructura/database/dbConnection.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerGruposEmpresa = async (usuarioId) => {

    // 1. Buscar la empresa asociada al usuario autenticado
    const empresa = await models.Empresa.findOne({
        where: {
            usuario_id: usuarioId
        }
    });

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró una empresa asociada al usuario"
        );
    }


    // 2. Buscar las aperturas de vacantes pertenecientes a la empresa
    const aperturas = await models.AperturaVacante.findAll({

        include: [

            {
                model: models.Vacante,
                required: true,

                include: [
                    {
                        model: models.Convenio,
                        required: true,

                        where: {
                            empresa_id: empresa.id
                        }
                    }
                ]
            },

            {
                model: models.Practica,
                as: "practica",
                required: true,

                include: [
                    {
                        model: models.Periodo,
                        required: true
                    }
                ]
            }

        ],

        order: [
            [
                {
                    model: models.Practica,
                    as: "practica"
                },
                models.Periodo,
                "nombre",
                "DESC"
            ]
        ]

    });


    // 3. Agrupar las aperturas por práctica
    const grupos = {};


    for (const apertura of aperturas) {

        const practica = apertura.practica;
        const periodo = practica.Periodo;


        if (!grupos[practica.id]) {

            /*
             * Buscar los practicantes de esta práctica
             * que realmente pertenecen a esta empresa.
             */
            const practicantes =
                await models.PracticaPracticante.findAll({

                    where: {
                        practica_id: practica.id,
                        estado: [
                            "En curso",
                            "Finalizada"
                        ]
                    },

                    include: [

                        {
                            model: models.Practicante,
                            as: "practicante",
                            required: true,

                            include: [

                                {
                                    model: models.Candidato,
                                    as: "candidato",
                                    required: true,

                                    include: [

                                        {
                                            model: models.Postulacion,
                                            required: true,

                                            where: {
                                                estado: "ACEPTADO"
                                            },

                                            include: [

                                                {
                                                    model: models.AperturaVacante,
                                                    required: true,

                                                    where: {
                                                        practica_id: practica.id
                                                    },

                                                    include: [

                                                        {
                                                            model: models.Vacante,
                                                            required: true,

                                                            include: [

                                                                {
                                                                    model: models.Convenio,
                                                                    required: true,

                                                                    where: {
                                                                        empresa_id: empresa.id
                                                                    }
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

                        }

                    ]

                });


            grupos[practica.id] = {

                practica_id: practica.id,

                periodo_id: periodo.id,

                periodo: periodo.nombre,

                fecha_inicio: practica.fecha_inicio,

                fecha_fin: practica.fecha_fin,

                estado: practica.estado,

                practicantes: practicantes.length,

                aperturas: []

            };

        }


        grupos[practica.id].aperturas.push({

            id: apertura.id,

            vacante_id: apertura.vacante_id,

            cupos: apertura.cupos,

            estado: apertura.estado,

            vacante: {

                id: apertura.Vacante.id,

                nombre: apertura.Vacante.nombre,

                descripcion: apertura.Vacante.descripcion

            }

        });

    }


    // 4. Convertir el objeto agrupado en arreglo
    return Object.values(grupos);

};