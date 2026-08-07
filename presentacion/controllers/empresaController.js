import { registerEmpresa } from "../../aplicacion/casos_de_uso/empresa/registrarEmpresa.js";
import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { sequelize } from "../../infraestructura/database/dbConnection.js";

export const registerEmpresaController = async (req, res) => {
    try {
        const resultado = await registerEmpresa(
            sequelize,
            userRepository,
            empresaRepository,
            rolRepository,
            archivoRepository,
            req.body,
            req.file
        );
        res.status(201).json(resultado);

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