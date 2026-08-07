import { getPracticantes } from "../../aplicacion/casos_de_uso/practicante/obtenerPracticantes.js";
import { PracticanteRepository } from "../../infraestructura/repositorios/practicanteRepositoryImpl.js";

export const getPracticantesController = async (req, res) => {
    try {
        const practicantes = await getPracticantes(PracticanteRepository);
        res.status(200).json(practicantes);
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