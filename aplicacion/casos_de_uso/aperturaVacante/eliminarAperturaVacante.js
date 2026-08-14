import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const eliminarAperturaVacante = async (
    aperturaVacanteRepository,
    id
) => {

    const apertura =
        await aperturaVacanteRepository.findById(id);


    if (!apertura) {

        throw new NotFoundError(
            "La apertura de vacante no existe."
        );

    }


    const postulaciones =
        await aperturaVacanteRepository
            .countByAperturaVacante(id);


    if (postulaciones > 0) {

        throw new BadRequestError(
            "No se puede eliminar la apertura porque tiene postulaciones."
        );

    }


    await aperturaVacanteRepository.delete(id);


    return {
        message: "Apertura de vacante eliminada correctamente."
    };

};