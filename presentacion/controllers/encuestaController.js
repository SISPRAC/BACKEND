import { crearPlantillaEncuesta }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/crearPlantillaEncuesta.js";

import { asignarPlantillaPeriodo }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/asignarPlantillaPeriodo.js";

import { getPlantillasEncuesta }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/getPlantillaEncuestas.js";

import { getPlantillaEncuesta }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/getPlantillaEncuesta.js";

import { actualizarPlantillaEncuesta }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/actualizarPlantillaEncuesta.js";

import { actualizarPeriodoPlantilla }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/actualizarPeriodoPlantilla.js";

import { eliminarPlantillaEncuesta }
from "../../aplicacion/casos_de_uso/plantillaEncuesta/eliminarPlantillaEncuesta.js";


import { plantillaEncuestaRepository }
from "../../infraestructura/repositorios/plantillaEncuestaRepositoryImpl.js";

import { periodoPlantillaRepository }
from "../../infraestructura/repositorios/periodoPlantillaRepositoryImpl.js";

import { preguntaRepository }
from "../../infraestructura/repositorios/preguntaRepositoryImpl.js";

import { opcionPreguntaRepository }
from "../../infraestructura/repositorios/opcionPreguntaRepositoryImpl.js";

import { rolRepository }
from "../../infraestructura/repositorios/rolRepositoryImpl.js";

import { periodoRepository }
from "../../infraestructura/repositorios/periodoRepositoryImpl.js";

import { respuestaEncuestaRepository }
from "../../infraestructura/repositorios/respuestaEncuestaRepositoryImpl.js";

import { respuestaPreguntaRepository }
from "../../infraestructura/repositorios/respuestasPreguntaRepositoryImpl.js";

// CREAR ENCUESTA
export const crearEncuestaController = async (req, res) => {

    try {

        // =========================
        // Crear plantilla base
        // =========================

        const encuesta =
            await crearPlantillaEncuesta(

                plantillaEncuestaRepository,

                rolRepository,

                req.body

            );


        // =========================
        // Asignar plantilla al periodo
        // =========================

        const periodoPlantilla =
            await asignarPlantillaPeriodo(

                plantillaEncuestaRepository,

                periodoRepository,

                periodoPlantillaRepository,

                preguntaRepository,

                opcionPreguntaRepository,

                {

                    plantilla_encuesta_id:
                        encuesta.id,

                    periodo_id:
                        req.body.periodo_id,

                    version:
                        req.body.version,

                    preguntas:
                        req.body.preguntas

                }

            );


        return res.status(201).json({

            message:
                "Encuesta creada correctamente",

            data: {

                plantilla: encuesta,

                periodoPlantilla

            }

        });


    } catch (error) {

        console.error(error);


        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};

// GET TODAS LAS ENCUESTAS
export const getEncuestasController = async (req, res) => {

    try {

        const encuestas =
            await getPlantillasEncuesta(

                plantillaEncuestaRepository

            );


        return res.status(200).json(encuestas);


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(error);


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};

// GET UNA ENCUESTA
export const getEncuestaController = async (req, res) => {

    try {

        const encuesta =
            await getPlantillaEncuesta(

                plantillaEncuestaRepository,

                req.params.id

            );


        return res.status(200).json(encuesta);


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(error);


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};


// ACTUALIZAR DATOS DE LA PLANTILLA
export const actualizarEncuestaController = async (req, res) => {

    try {

        const encuesta =
            await actualizarPlantillaEncuesta(

                plantillaEncuestaRepository,

                rolRepository,

                req.params.id,

                req.body

            );


        return res.status(200).json({

            message:
                "Encuesta actualizada correctamente",

            data:
                encuesta

        });


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(
            "Error actualizar encuesta:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};

// ACTUALIZAR VERSION DE ENCUESTA
export const actualizarPeriodoPlantillaController = async (req, res) => {

    try {

        const periodoPlantilla =
            await actualizarPeriodoPlantilla(

                periodoPlantillaRepository,

                preguntaRepository,

                opcionPreguntaRepository,

                respuestaPreguntaRepository,

                req.params.id,

                req.body

            );


        return res.status(200).json({

            message:
                "Versión de encuesta actualizada correctamente",

            data:
                periodoPlantilla

        });


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(
            "Error actualizar versión de encuesta:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};

// ELIMINAR ENCUESTA
export const eliminarEncuestaController = async (req, res) => {

    try {

        const respuesta =
            await eliminarPlantillaEncuesta(

                plantillaEncuestaRepository,

                respuestaEncuestaRepository,

                req.params.id

            );


        return res.status(200).json(respuesta);


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(
            "Error eliminar encuesta:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};