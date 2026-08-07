import {registrarHistorialConvenio} from "../../aplicacion/casos_de_uso/historialConvenio/registrarHistorial.js";
import { historialConvenioRepository } from "../../infraestructura/repositorios/historialConvenioRepositoryImpl.js";


export const RegistrarHistorialConvenioController = async (req, res) => {

    try {
        const result = await registrarHistorialConvenio(
           historialConvenioRepository,
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