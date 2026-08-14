import { registrarPostulaciones } from "../../aplicacion/casos_de_uso/postulacion/registrarPostulacion.js";
import { postulacionRepository } from "../../infraestructura/repositorios/PostulacionRepositoryImpl.js";
import { eliminarPostulacion } from "../../aplicacion/casos_de_uso/postulacion/eliminarPostulacion.js";
import { candidatoRepository } from "../../infraestructura/repositorios/candidatoRepositoryImpl.js";
import { aperturaVacanteRepository } from "../../infraestructura/repositorios/aperturaVacanteRepositoryImpl.js";
import { obtenerCandidatosEmpresa } from "../../aplicacion/casos_de_uso/postulacion/obtenerCandidatosEmpresa.js";
import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";


export const registrarPostulacionesController = async (req, res) => {
    try {

        const { aperturaVacanteId, candidatosIds } = req.body;

        const postulaciones = await registrarPostulaciones(
            {
                postulacionRepository,
                candidatoRepository,
                aperturaVacanteRepository
            },
            aperturaVacanteId,
            candidatosIds
        );

        return res.status(201).json({
            message: "Postulaciones registradas correctamente",
            data: postulaciones
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        });
    }
};


export const eliminarPostulacionController = async (
    req,
    res,
    next
) => {
    try {

        const {
            candidatoId,
            aperturaVacanteId
        } = req.params;

        const resultado =
            await eliminarPostulacion(
                {
                    postulacionRepository,
                    aperturaVacanteRepository
                },
                candidatoId,
                aperturaVacanteId
            );

        res.status(200).json(resultado);

    } catch (error) {
        next(error);
    }
};


export const obtenerCandidatosEmpresaController = async (
    req,
    res,
    next
) => {
    try {

        const candidatos = await obtenerCandidatosEmpresa(
            {
                empresaRepository,
                postulacionRepository
            },
            req.user.id
        );

        return res.status(200).json({
            data: candidatos
        });

    } catch (error) {
        next(error);
    }
};