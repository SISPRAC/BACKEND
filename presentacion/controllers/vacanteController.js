import { getVacantes } from "../../aplicacion/casos_de_uso/vacante/getVacantes.js";
import { vacanteRepository } from "../../infraestructura/repositorios/vacanteRepositoryImpl.js";
export const getVacantesController = async (req, res) => {
   try {
     const vacantes = await getVacantes(vacanteRepository);
     res.status(200).json(vacantes);
   } catch (error) {
     if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"+ error.message
        });
    
   }
 };