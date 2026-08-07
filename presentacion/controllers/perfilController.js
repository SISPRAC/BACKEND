import { crearPerfil } from "../../aplicacion/casos_de_uso/perfil/createPerfil.js";
import { getPerfiles } from "../../aplicacion/casos_de_uso/perfil/getPerfiles.js";
import { perfilRepository } from "../../infraestructura/repositorios/perfilRepositoryImpl.js";

export const CrearPerfilController = async (req, res) => {

    try {
        const result = await crearPerfil(
            perfilRepository,
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
            message: "Error interno del servidor"
        });
    }

 };
 
 export const getPerfilesController = async (req, res) => {
   try {
     const perfiles = await getPerfiles(perfilRepository);
     res.status(200).json(perfiles);
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