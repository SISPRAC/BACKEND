import { createRol } from "../../aplicacion/casos_de_uso/rol/createRol.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import { getRoles } from "../../aplicacion/casos_de_uso/rol/getRoles.js";

export const crearRolController = async (req, res) => {
    try {
        const rol = await createRol(rolRepository, req.body);
        res.json(rol);
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

export const getRolesController = async (req, res) => {
    try {
        const roles = await getRoles(rolRepository);

        res.status(200).json({
            ok: true,
            roles
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