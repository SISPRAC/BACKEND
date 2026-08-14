import { aperturaVacanteRepository } from "../../infraestructura/repositorios/aperturaVacanteRepositoryImpl.js";
import { vacanteRepository } from "../../infraestructura/repositorios/vacanteRepositoryImpl.js";
import { practicaRepository } from "../../infraestructura/repositorios/practicaRepositoryImpl.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";
import { convenioRepository } from "../../infraestructura/repositorios/convenioRepositoryImpl.js";

import { crearAperturaVacante } from "../../aplicacion/casos_de_uso/aperturaVacante/crearAperturaVacante.js";
import { getAperturasVacantes } from "../../aplicacion/casos_de_uso/aperturaVacante/getAperturasVacantes.js";
import { getAperturaVacanteById } from "../../aplicacion/casos_de_uso/aperturaVacante/getAperturaVacanteById.js";
import { actualizarAperturaVacante } from "../../aplicacion/casos_de_uso/aperturaVacante/actualizarAperturaVacante.js";
import { eliminarAperturaVacante } from "../../aplicacion/casos_de_uso/aperturaVacante/eliminarAperturaVacante.js";


export const crearAperturaVacanteController = async (
    req,
    res,
    next
) => {

    try {

        const apertura =
            await crearAperturaVacante(
                aperturaVacanteRepository,
                vacanteRepository,
                practicaRepository,
                tutorEmpresaRepository,
                convenioRepository,
                req.body
            );


        return res.status(201).json(
            apertura
        );

    } catch (error) {

        next(error);

    }

};


export const getAperturasVacantesController = async (
    req,
    res,
    next
) => {

    try {

        const aperturas =
            await getAperturasVacantes(
                aperturaVacanteRepository
            );


        return res.status(200).json(
            aperturas
        );

    } catch (error) {

        console.log("error", error);

        if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }

};


export const getAperturaVacanteByIdController = async (
    req,
    res,
    next
) => {

    try {

        const apertura =
            await getAperturaVacanteById(
                aperturaVacanteRepository,
                req.params.id
            );


        return res.status(200).json(
            apertura
        );

    } catch (error) {

        if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }

};


export const actualizarAperturaVacanteController = async (
    req,
    res,
    next
) => {

    try {

        const apertura =
            await actualizarAperturaVacante(
                aperturaVacanteRepository,
                req.body,
                req.params.id
            );


        return res.status(200).json(
            apertura
        );

    } catch (error) {

         if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }

};


export const eliminarAperturaVacanteController = async (
    req,
    res,
    next
) => {

    try {

        const resultado =
            await eliminarAperturaVacante(
                aperturaVacanteRepository,
                req.params.id
            );


        return res.status(200).json(
            resultado
        );

    } catch (error) {

        if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }

};