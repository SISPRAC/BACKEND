import { crearPlantillaEncuesta }
    from "../../aplicacion/casos_de_uso/plantillaEncuesta/crearPlantillaEncuesta.js";

import { asignarPlantillaPractica }
    from "../../aplicacion/casos_de_uso/plantillaEncuesta/asignarPlantillaPractica.js";

import { getPlantillasEncuesta }
    from "../../aplicacion/casos_de_uso/plantillaEncuesta/getPlantillaEncuestas.js";

import { getPlantillaEncuesta }
    from "../../aplicacion/casos_de_uso/plantillaEncuesta/getPlantillaEncuesta.js";

import { actualizarPlantillaEncuesta }
    from "../../aplicacion/casos_de_uso/plantillaEncuesta/actualizarPlantillaEncuesta.js";

import { eliminarPlantillaEncuesta }
    from "../../aplicacion/casos_de_uso/plantillaEncuesta/eliminarPlantillaEncuesta.js";

import { plantillaEncuestaRepository }
    from "../../infraestructura/repositorios/plantillaEncuestaRepositoryImpl.js";

import { practicaRepository }
    from "../../infraestructura/repositorios/practicaRepositoryImpl.js";

import { practicaEncuestaRepository }
    from "../../infraestructura/repositorios/practicaEncuestaRepositoryImpl.js";

import { preguntaRepository }
    from "../../infraestructura/repositorios/preguntaRepositoryImpl.js";

import { opcionPreguntaRepository }
    from "../../infraestructura/repositorios/opcionPreguntaRepositoryImpl.js";

import { rolRepository }
    from "../../infraestructura/repositorios/rolRepositoryImpl.js";

import { respuestaEncuestaRepository }
    from "../../infraestructura/repositorios/respuestaEncuestaRepositoryImpl.js";

import { obtenerEncuestasEvaluacionPracticante }
    from "../../aplicacion/casos_de_uso/encuestas/obtenerEncuestasEvaluacionPracticante.js";

import { obtenerEncuestasPracticante }
    from "../../aplicacion/casos_de_uso/encuestas/obtenerEncuestasPracticante.js";

import { responderEncuestaEvaluacionPracticante }
    from "../../aplicacion/casos_de_uso/encuestas/responderEncuestaEvaluacionPracticante.js";

import { respuestaPreguntaRepository }
    from "../../infraestructura/repositorios/respuestasPreguntaRepositoryImpl.js";

import { responderEncuestaPracticante }
    from "../../aplicacion/casos_de_uso/encuestas/responderEncuestaPracticante.js";

import { obtenerRespuestasEncuestasPracticante } from "../../aplicacion/casos_de_uso/encuestas/obtenerRespuestasEncuestasPracticante.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";

// ========================================
// CREAR ENCUESTA
// ========================================

export const crearEncuestaController = async (req, res) => {

    try {

        const encuesta =
            await crearPlantillaEncuesta(

                sequelize,

                plantillaEncuestaRepository,

                preguntaRepository,

                opcionPreguntaRepository,

                rolRepository,

                req.body

            );


        return res.status(201).json({

            message:
                "Encuesta creada correctamente",

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
            "Error crear encuesta:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};


// ========================================
// ASIGNAR ENCUESTA A UNA PRÁCTICA
// ========================================

export const asignarEncuestaPracticaController = async (req, res) => {

    try {

        const practicaEncuesta =
            await asignarPlantillaPractica(

                plantillaEncuestaRepository,

                practicaRepository,

                practicaEncuestaRepository,

                req.body

            );


        return res.status(201).json({

            message:
                "Encuesta asignada correctamente a la práctica",

            data:
                practicaEncuesta

        });


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(
            "Error asignar encuesta a práctica:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};


// ========================================
// GET TODAS LAS ENCUESTAS
// ========================================

export const getEncuestasController = async (req, res) => {

    try {

        const encuestas =
            await getPlantillasEncuesta(

                plantillaEncuestaRepository

            );


        return res.status(200).json(

            encuestas

        );


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(
            "Error obtener encuestas:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};


// ========================================
// GET UNA ENCUESTA
// ========================================

export const getEncuestaController = async (req, res) => {

    try {

        const encuesta =
            await getPlantillaEncuesta(

                plantillaEncuestaRepository,

                req.params.id

            );


        return res.status(200).json(

            encuesta

        );


    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({

                message:
                    error.message

            });

        }


        console.error(
            "Error obtener encuesta:",
            error
        );


        return res.status(500).json({

            message:
                "Error interno del servidor"

        });

    }

};


// ========================================
// ACTUALIZAR ENCUESTA
// ========================================

export const actualizarEncuestaController = async (req, res) => {

    try {

        const encuesta =
            await actualizarPlantillaEncuesta(

                plantillaEncuestaRepository,

                practicaEncuestaRepository,

                preguntaRepository,

                opcionPreguntaRepository,

                respuestaEncuestaRepository,

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


// ========================================
// ELIMINAR ENCUESTA
// ========================================

export const eliminarEncuestaController = async (req, res) => {

    try {

        const respuesta =
            await eliminarPlantillaEncuesta(

                plantillaEncuestaRepository,

                practicaEncuestaRepository,

                req.params.id

            );


        return res.status(200).json(

            respuesta

        );


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

// ========================================
// OBTENER ENCUESTAS DE EVALUACIÓN DEL PRACTICANTE
// ========================================

export const obtenerEncuestasEvaluacionPracticanteController = async (req, res) => {

    try {

        const encuestas =
            await obtenerEncuestasEvaluacionPracticante(
                { plantillaEncuestaRepository, respuestaEncuestaRepository},
                req.params.practicante_id,
                req.params.rolEvaluador
            );

        return res.status(200).json(
            encuestas
        );

    } catch (error) {

        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });

        }

        console.error(
            "Error obtener encuestas de evaluación del practicante:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor"
        });

    }

};

// ========================================
// OBTENER ENCUESTAS DEL PRACTICANTE
// ========================================

export const obtenerEncuestasPracticanteController = async (req, res) => {

    try {

        const encuestas =
            await obtenerEncuestasPracticante(
                {
                    plantillaEncuestaRepository,
                    respuestaEncuestaRepository,
                },
                req.user.id
            );

        return res.status(200).json(
            encuestas
        );

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(
            "Error obtener encuestas del practicante:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor"
        });

    }

};


// ========================================
// RESPONDER ENCUESTA DE EVALUACIÓN DEL PRACTICANTE
// ========================================

export const responderEncuestaEvaluacionPracticanteController = async (req, res) => {

    try {

        const respuesta =
            await responderEncuestaEvaluacionPracticante(
                {
                    plantillaEncuestaRepository,
                    respuestaEncuestaRepository,
                    respuestaPreguntaRepository,
                },
                req.user.id,
                req.body.practicante_id,
                req.body.practica_encuesta_id,
                req.body.respuestas
            );

        return res.status(201).json({
            message: "Encuesta respondida correctamente",
            data: respuesta,
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error(
            "Error responder encuesta de evaluación del practicante:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });

    }

};


// ========================================
// RESPONDER ENCUESTA DEL PRACTICANTE
// ========================================

export const responderEncuestaPracticanteController = async (req, res) => {

    try {

        const respuesta =
            await responderEncuestaPracticante(
                {
                    plantillaEncuestaRepository,
                    respuestaEncuestaRepository,
                    respuestaPreguntaRepository,
                },
                req.user.id,
                req.body.practica_encuesta_id,
                req.body.respuestas
            );

        return res.status(201).json({
            message: "Encuesta respondida correctamente",
            data: respuesta,
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error(
            "Error responder encuesta del practicante:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });

    }

};

export const obtenerRespuestasEncuestasPracticanteController = async (
    req,
    res
) => {
    try {
        const resultado = await obtenerRespuestasEncuestasPracticante(
            {
                plantillaEncuestaRepository,
                respuestaEncuestaRepository,
            },
            req.params.practicante_id
        );

        return res.status(200).json(resultado);
    } catch (error) {
        console.error(
            "Error al obtener las respuestas de las encuestas del practicante:",
            error
        );

        return res.status(error.statusCode || 500).json({
            message:
                error.statusCode
                    ? error.message
                    : "Error interno al consultar las encuestas del practicante",
        });
    }
};
