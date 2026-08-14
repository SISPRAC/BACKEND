import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getVacanteById = async (
    {
        vacanteRepository
    },
    id
) => {

    const vacante =
        await vacanteRepository.findById(id);

    if (!vacante) {
        throw new NotFoundError(
            "No se encontró la vacante"
        );
    }

    return vacante;
};