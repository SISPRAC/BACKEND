import { registerCandidato } from "../../aplicacion/casos_de_uso/candidato/registrarCandidato.js";
import { updateCandidato } from "../../aplicacion/casos_de_uso/candidato/actualizarCandidato.js";
import { getCandidatos } from "../../aplicacion/casos_de_uso/candidato/getCandidatos.js";
import { getCandidatosDisponibles } from "../../aplicacion/casos_de_uso/candidato/getCandidatosDisponibles.js";
import { getCandidatosPerfil } from "../../aplicacion/casos_de_uso/candidato/getCandidatosPerfil.js";

import { candidatoRepository } from "../../infraestructura/repositorios/candidatoRepositoryImpl.js";
import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import { perfilRepository } from "../../infraestructura/repositorios/perfilRepositoryImpl.js";
import { candidatoPerfilRepository } from "../../infraestructura/repositorios/candidatoPerfilRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";

export const registerCandidatoController = async (req, res) => {

    try {

        const result = await registerCandidato(
            sequelize,
            userRepository,
            candidatoRepository,
            rolRepository,
            perfilRepository,
            candidatoPerfilRepository,
            archivoRepository,
            req.body,
            req.file
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

export const updateCandidatoController = async (req, res) => {

    try {

        const result = await updateCandidato(
            sequelize,
            userRepository,
            candidatoRepository,
            perfilRepository,
            candidatoPerfilRepository,
            archivoRepository,
            req.params.id,
            req.body,
            req.file
        );

        return res.status(200).json(result);

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

export const getCandidatosController = async (req, res) => {

    try {

        const candidatos =
            await getCandidatos(candidatoRepository);

        return res.status(200).json(candidatos);

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

export const getCandidatosDisponiblesController = async (req, res) => {

    try {

        const candidatos =
            await getCandidatosDisponibles(
                candidatoRepository
            );

        return res.status(200).json(candidatos);

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

export const getCandidatosPerfilController = async (req, res) => {

    try {

        const candidatos = await getCandidatosPerfil(
            candidatoRepository,
            req.params.perfilNombre
        );

        return res.status(200).json(candidatos);

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