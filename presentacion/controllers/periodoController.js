import { update } from "../../aplicacion/casos_de_uso/periodo/updatePeriodo.js";
import { crearPeriodo } from "../../aplicacion/casos_de_uso/periodo/createPeriodo.js";
import {deletePeriodo} from "../../aplicacion/casos_de_uso/periodo/deletePeriodo.js";
import {getPeriodo} from "../../aplicacion/casos_de_uso/periodo/getPeriodo.js";
import {getPeriodos} from "../../aplicacion/casos_de_uso/periodo/getPeriodos.js";
import { periodoRepository } from "../../infraestructura/repositorios/periodoRepositoryImpl.js";
 
export const CrearPeriodoController = async (req, res) => {

    try {

        const result = await crearPeriodo(
            periodoRepository,
            req.body
        );

        return res.status(201).json(result);

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

export const deletePeriodoController = async (req, res) => {
  try {
    const deleted = await deletePeriodo(periodoRepository, req.params.id);
    res.status(200).json({ message: "periodo eliminado correctamente" });

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

export const getPeriodosController = async (req, res) => {
  try {
    const periodos = await getPeriodos( periodoRepository);
    return res.status(200).json(periodos);

    console.log("periodos", periodos);
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

export const getPeriodoController = async (req, res) => {
  try {
  
    const periodo = await getPeriodo(periodoRepository, req.params.id);
    res.status(200).json(periodo);

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

export const updatePeriodoController = async (req, res) => {

    try {
        const periodoActualizado = await update(
            periodoRepository,
            req.params.id,
            req.body
        );

        res.status(200).json(periodoActualizado);

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