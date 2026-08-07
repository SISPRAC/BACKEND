import { getConvenios } from "../../aplicacion/casos_de_uso/convenio/getConvenios.js";
import { getConvenio } from "../../aplicacion/casos_de_uso/convenio/getConvenio.js";
import { convenioRepository } from "../../infraestructura/repositorios/convenioRepositoryImpl.js";
import { cambiarEstadoConvenio } from "../../aplicacion/casos_de_uso/convenio/actualizarEstadoConvenio.js";
import { historialConvenioRepository } from "../../infraestructura/repositorios/historialConvenioRepositoryImpl.js";

export const getConveniosController = async (req, res) => {
    try {
        const convenios = await getConvenios(convenioRepository);
        res.status(200).json(convenios);
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

export const getConvenioController = async (req, res) => {
    try {

        const convenioId = req.params.id;

        const convenio = await getConvenio(
            convenioRepository,
            convenioId
        );

        res.status(200).json(convenio);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
};

export const actualizarEstadoConvenioController = async (req, res) => {
    try {
        const convenioActualizado = await cambiarEstadoConvenio(
            convenioRepository,
            historialConvenioRepository,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Estado del convenio actualizado correctamente",
            data: convenioActualizado
        });

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};