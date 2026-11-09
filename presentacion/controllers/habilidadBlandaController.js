import { getHabilidadesBlandas } from "../../aplicacion/casos_de_uso/habilidadBlanda/getHabilidadesBlandas.js";

import { habilidadBlandaRepository } from "../../infraestructura/repositorios/habilidadBlandaRepositoryImpl.js";


export const getHabilidadesBlandasController = async (req, res) => {

    try {

        const habilidades = await getHabilidadesBlandas(
            habilidadBlandaRepository
        );

        return res.status(200).json(habilidades);

    } catch (error) {

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.log("Error al consultar habilidades blandas:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};