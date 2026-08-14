import { getAperturasVacantes} from "../../aplicacion/casos_de_uso/vacante/getAperturasVacantes.js";
import { vacanteRepository } from "../../infraestructura/repositorios/vacanteRepositoryImpl.js";

import { crearVacante } from "../../aplicacion/casos_de_uso/vacante/crearVacante.js";
import { actualizarVacante } from "../../aplicacion/casos_de_uso/vacante/actualizarVacante.js";
import { getVacanteById } from "../../aplicacion/casos_de_uso/vacante/getVacanteById.js";
import { getVacantesByEmpresa } from "../../aplicacion/casos_de_uso/vacante/getVacantesByEmpresa.js"; 
import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";
import { convenioRepository } from "../../infraestructura/repositorios/convenioRepositoryImpl.js";

export const getAperturasVacantesController = async (req, res) => {
  try {
    const vacantes = await getAperturasVacantes(vacanteRepository);
    res.status(200).json(vacantes);
  } catch (error) {
    console.log("Error en getAperturasVacantesController:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor" + error.message
    });

  }
};

export const crearVacanteController = async (req, res, next) => {

    try {

        const vacante = await crearVacante(
            {
                empresaRepository,
                convenioRepository,
                vacanteRepository
            },
            req.user.id,
            req.body
        );

        return res.status(201).json({
            message: "Vacante creada correctamente",
            data: vacante
        });

    } catch (error) {
        next(error);
    }
};

export const actualizarVacanteController = async (
    req,
    res,
    next
) => {

    try {

        const vacante = await actualizarVacante(
            {
                empresaRepository,
                vacanteRepository
            },
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Vacante actualizada correctamente",
            data: vacante
        });

    } catch (error) {
        next(error);
    }
};

export const getVacanteByIdController = async (
    req,
    res,
    next
) => {

    try {

        const vacante = await getVacanteById(
            {
                vacanteRepository
            },
            req.params.id
        );

        return res.status(200).json({
            data: vacante
        });

    } catch (error) {
        next(error);
    }
};

export const getVacantesByEmpresaController = async (
    req,
    res,
    next
) => {

    try {

        const vacantes = await getVacantesByEmpresa(
            {
                empresaRepository,
                vacanteRepository
            },
            req.user.id
        );

        return res.status(200).json({
            data: vacantes
        });

    } catch (error) {
        next(error);
    }
};