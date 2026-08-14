import { crearGrupo } from "../../aplicacion/casos_de_uso/grupo/createGrupo.js";
import { getGrupos } from "../../aplicacion/casos_de_uso/grupo/getGrupos.js";
import { getGrupo } from "../../aplicacion/casos_de_uso/grupo/getGrupo.js";
import { grupoRepository } from "../../infraestructura/repositorios/grupoRepositoryImpl.js";
import { grupoCandidatoRepository } from "../../infraestructura/repositorios/grupoCandidatoRepository.js";
import { getCandidatosGrupo } from "../../aplicacion/casos_de_uso/grupo/getCandidatosGrupo.js";
import { eliminarGrupo } from "../../aplicacion/casos_de_uso/grupo/eliminarGrupo.js";
import { editarGrupo } from "../../aplicacion/casos_de_uso/grupo/editarGrupo.js";

export const CrearGrupoController = async (req, res) => {

    try {

        const result = await crearGrupo(
            grupoRepository,
            grupoCandidatoRepository,
            req.body
        );

        res.status(201).json(result);

    } catch (error) {

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

export const getGruposController = async (req, res) => {

    try {

        const grupos = await getGrupos(grupoRepository);

        res.status(200).json(grupos);

    } catch (error) {

        console.log("Error en getGruposController:", error);

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

export const getCandidatosByGrupoController = async (req, res) => {

    try {

        const grupoId = req.params.id;

        const candidatos = await getCandidatosGrupo(
            grupoRepository,
            grupoId
        );

        res.status(200).json(candidatos);

    } catch (error) {

        console.log("Error en getCandidatosByGrupoController:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener candidatos del grupo" + error.message
        });
    }
};

export const getGrupoController = async (req, res) => {

    try {

        const grupoId = req.params.id;

        const grupo = await getGrupo(
            grupoRepository,
            grupoId
        );

        res.status(200).json(grupo);

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

export const EditarGrupoController = async (req, res) => {

    try {

        const grupoId = req.params.id;

        const result = await editarGrupo(
            grupoRepository,
            grupoCandidatoRepository,
            req.body,
            grupoId
        );

        return res.status(200).json(result);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al editar el grupo"
        });
    }
};

export const deleteGrupoController = async (req, res) => {

    try {

        const result = await eliminarGrupo(
            grupoRepository,
            grupoCandidatoRepository,
            req.params.id
        );

        res.status(200).json(result);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al eliminar el grupo"
        });
    }
};