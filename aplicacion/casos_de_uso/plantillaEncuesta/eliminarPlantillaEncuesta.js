import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";


export const eliminarPlantillaEncuesta = async (

    plantillaEncuestaRepository,
    respuestaEncuestaRepository,
    id

)=>{


    const encuesta = 
    await plantillaEncuestaRepository.findById(id);



    if(!encuesta){

        throw new NotFoundError(
            "La encuesta no existe"
        );

    }



    const respuestas =
    await respuestaEncuestaRepository.countByPlantilla(
        id
    );



    if(respuestas > 0){

        throw new ConflictError(
            "No se puede eliminar la encuesta porque tiene respuestas registradas"
        );

    }



    await plantillaEncuestaRepository.delete(id);



    return {

        message:"Encuesta eliminada correctamente"

    };


};