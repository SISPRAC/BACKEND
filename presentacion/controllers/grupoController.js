import { crearGrupo } from "../../aplicacion/casos_de_uso/grupo/createGrupo.js";
import { getGrupos } from "../../aplicacion/casos_de_uso/grupo/getGrupos.js";
import { getGrupo } from "../../aplicacion/casos_de_uso/grupo/getGrupo.js";
import { grupoRepository } from "../../infraestructura/repositorios/grupoRepositoryImpl.js";
import { candidatoRepository } from "../../infraestructura/repositorios/candidatoRepositoryImpl.js";
import { getCandidatosByGrupo } from "../../aplicacion/casos_de_uso/grupo/getCandidatosGrupo.js";
import { deleteGrupo } from "../../aplicacion/casos_de_uso/grupo/eliminarGrupo.js";
import { editarGrupo } from "../../aplicacion/casos_de_uso/grupo/editarGrupo.js";

export const CrearGrupoController = async (req, res) => {

    try {
        const result = await crearGrupo(
            grupoRepository,
            candidatoRepository,
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
        const candidatos = await getCandidatosByGrupo(grupoRepository, grupoId);
        res.status(200).json(candidatos);
    } catch (error) {
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
        const grupo = await getGrupo(grupoRepository, grupoId);
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
            candidatoRepository,
            grupoId,
            req.body
        );

        return res.status(200).json(result);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json(
            { message: "Error al editar el grupo" }
        );
    }
};

export const deleteGrupoController = async (req, res) => {
    try {
        const result = await deleteGrupo(
            grupoRepository,
            candidatoRepository,
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
