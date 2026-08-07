import { registerCandidato } from "../../aplicacion/casos_de_uso/candidato/registrarCandidato.js";
import { sequelize } from "../../infraestructura/database/dbConnection.js";
import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { candidatoRepository } from "../../infraestructura/repositorios/candidatoRepositoryImpl.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import { perfilRepository } from "../../infraestructura/repositorios/perfilRepositoryImpl.js";
import { candidatoPerfilRepository } from "../../infraestructura/repositorios/candidatoPerfilRepositoryImpl.js";
import { getCandidatos, getCandidatosDisponibles } from "../../aplicacion/casos_de_uso/candidato/getCandidatos.js";
import { getCandidatosPerfil } from "../../aplicacion/casos_de_uso/perfil/getCandidatoPerfil.js"
import { updateCandidato } from "../../aplicacion/casos_de_uso/candidato/actualizarCandidato.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

export const registrarCandidatoController = async (req, res) => {

    try {

        const resultado = await registerCandidato(
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

        return res.status(201).json({
            message: "Candidato registrado correctamente.",
            data: resultado
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            message:
                error.message ||
                "Error al registrar candidato."
        });
    }
};

export const getCandidatosController = async (req, res) => {
    try {
        const candidatos = await getCandidatos(candidatoRepository);
        res.status(200).json(candidatos);
    } catch (error) {
        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR", error: error.message
        });
    }
};

export const getCandidatosDisponiblesController = async (req, res) => {
    try {
        const candidatos = await getCandidatosDisponibles(candidatoRepository);

        res.status(200).json(candidatos);
    }
    catch (error) {
        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR", error: error
        });
    }
};

export const updateCandidatoController = async (req, res, next) => {

    try {

        const { id } = req.params;

        const resultado = await updateCandidato(
            sequelize,
            userRepository,
            candidatoRepository,
            perfilRepository,
            candidatoPerfilRepository,
            archivoRepository,
            id,
            req.body,
            req.file
        );

        return res.status(200).json({
            message: "CANDIDATE_UPDATED",
            data: resultado
        });

    } catch (error) {
        next(error);
    }

};

export const getCandidatoPerfilController = async (req, res) => {
    try {
        const { nombrePerfil } = req.params;

        const candidatos = await getCandidatosPerfil(
            { candidatoRepository },
            nombrePerfil
        );

        res.status(200).json(candidatos);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR",
            error: error.message
        });
    }
};