import { getIdiomas } from "../../aplicacion/casos_de_uso/idioma/getIdiomas.js";

import { idiomaRepository } from "../../infraestructura/repositorios/idiomaRepository.js";


export const getIdiomasController = async (req, res) => {

    try {

        const idiomas = await getIdiomas(
            idiomaRepository
        );

        return res.status(200).json(idiomas);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.log("Error al consultar idiomas:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};