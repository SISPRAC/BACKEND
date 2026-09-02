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