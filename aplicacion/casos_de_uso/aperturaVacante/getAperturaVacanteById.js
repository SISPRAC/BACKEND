import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getAperturaVacanteById = async (
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


    return apertura;

};