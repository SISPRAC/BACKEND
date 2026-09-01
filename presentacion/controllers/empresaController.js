import { registerEmpresa } from "../../aplicacion/casos_de_uso/empresa/registrarEmpresa.js";
import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { sequelize } from "../../infraestructura/database/dbConnection.js";
import { actualizarEmpresa } from "../../aplicacion/casos_de_uso/empresa/actualizarEmpresa.js";
import { obtenerEmpresa } from "../../aplicacion/casos_de_uso/empresa/obtenerEmpresa.js";
import { obtenerGruposEmpresa } from "../../aplicacion/casos_de_uso/empresa/getMisGruposPractica.js";
import { obtenerDetalleGrupoEmpresa } from "../../aplicacion/casos_de_uso/empresa/getDetalleGrupoPractica.js";
import { invitarEmpresa } from "../../aplicacion/casos_de_uso/invitarUsuario/invitarEmpresa.js";

export const registerEmpresaController = async (req, res) => {

    try {

        const invitacion = req.invitacion;

        if (invitacion.rol !== "Empresa") {
            return res.status(403).json({
                message:
                    "Esta invitación no corresponde al registro de una empresa"
            });
        }

        const resultado = await registerEmpresa(
            sequelize,
            userRepository,
            empresaRepository,
            rolRepository,
            {
                ...req.body,
                correo: invitacion.correo
            },
            req.file
        );

        return res.status(201).json(resultado);

    } catch (error) {

        console.log(
            "Error en registerEmpresaController:",
            error
        );

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

export const actualizarEmpresaController = async (req, res) => {

    try {

        const resultado = await actualizarEmpresa(
            req.params.id,
            userRepository,
            empresaRepository,
            req.body,
            req.file
        );

        return res.status(200).json({
            message: "Empresa actualizada correctamente",
            ...resultado
        });

    } catch (error) {

        console.log(
            "Error en actualizarEmpresaController:",
            error
        );

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

export const obtenerEmpresaController = async (req, res) => {

    try {

        const usuarioId = req.user.id;

        const empresa = await obtenerEmpresa(
            empresaRepository,
            usuarioId
        );

        return res.status(200).json(empresa);

    } catch (error) {

        console.log(
            "Error en obtenerEmpresaController:",
            error
        );

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

export const obtenerGruposEmpresaController = async (req, res, next) => {
    try {

        const usuarioId = req.user.id;

        const grupos = await obtenerGruposEmpresa(usuarioId);

        return res.status(200).json({
            success: true,
            data: grupos
        });

    } catch (error) {
        next(error);
    }
};

export const obtenerDetalleGrupoEmpresaController = async (
    req,
    res,
    next
) => {

    try {

        const usuarioId = req.user.id;

        const { practicaId } = req.params;

        const data =
            await obtenerDetalleGrupoEmpresa(
                usuarioId,
                practicaId
            );

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        next(error);

    }

};

export const invitarEmpresaController = async (req, res) => {

    try {

        const resultado = await invitarEmpresa({
            correo: req.body.correo,
            nombreEmpresa: req.body.nombreEmpresa
        });

        return res.status(200).json(resultado);

    } catch (error) {

        console.log(
            "Error en invitarEmpresaController:",
            error
        );

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