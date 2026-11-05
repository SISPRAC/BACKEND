import { retiroPracticanteRepository }
    from "../../infraestructura/repositorios/retiroPracticanteRepository.js";

import { practicaPracticanteRepository }
    from "../../infraestructura/repositorios/PracticaPracticanteRepositoryImpl.js";

import { retirarPracticante }
    from "../../aplicacion/casos_de_uso/retiroPracticante/retirarPracticante.js";

import { listarRetirosPracticante }
    from "../../aplicacion/casos_de_uso/retiroPracticante/listarRetirosPracticante.js";

import { obtenerRetiroPracticante }
    from "../../aplicacion/casos_de_uso/retiroPracticante/obtenerRetiroPracticante.js";

import { obtenerRetirosPorPracticante }
    from "../../aplicacion/casos_de_uso/retiroPracticante/obtenerRetirosPorPracticante.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

export const crearRetiroPracticante = async (req, res, next) => {
    try {
        const { motivo } = req.body;

        const roles = req.user?.roles ?? [];
        const esAutoRetiro = roles.includes("Practicante");

        const data = {
            motivo,
            usuario_id: req.user.id,
            // Si es practicante, ignora lo que venga en el body
            practicante_id: esAutoRetiro
                ? req.user.practicante_id
                : req.body.practicante_id,
            esAutoRetiro
        };

        const retiro = await retirarPracticante(
            retiroPracticanteRepository,
            practicaPracticanteRepository,
            archivoRepository,
            data,
            req.file
        );

        res.status(201).json({ data: retiro });
    } catch (error) {
        next(error);
    }
};

export const listarRetiros = async (req, res) => {

    try {

        const retiros =
            await listarRetirosPracticante(
                retiroPracticanteRepository
            );

        return res.status(200).json({
            data: retiros
        });

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

export const obtenerRetiro = async (req, res) => {

    try {

        const { id } = req.params;

        const retiro =
            await obtenerRetiroPracticante(
                retiroPracticanteRepository,
                id
            );

        return res.status(200).json({
            data: retiro
        });

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

export const obtenerRetirosDePracticante = async (req, res) => {

    try {

        const { practicanteId } = req.params;

        const retiros =
            await obtenerRetirosPorPracticante(
                retiroPracticanteRepository,
                practicanteId
            );

        return res.status(200).json({
            data: retiros
        });

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