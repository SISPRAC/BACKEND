import { NotFoundError } from "../../../shared/errors/NotFoundError.js";


export const getPlantillaEncuesta = async (

    plantillaEncuestaRepository,

    id

)=>{

    const encuesta = await plantillaEncuestaRepository.findById(id);

    if(!encuesta){

        throw new NotFoundError(
            "La encuesta no existe"
        );

    }



    return encuesta;


};