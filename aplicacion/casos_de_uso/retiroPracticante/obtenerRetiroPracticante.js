import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerRetiroPracticante = async (
    retiroPracticanteRepository,
    id
) => {

    const retiro =
        await retiroPracticanteRepository.findById(id);

    if (!retiro) {
        throw new NotFoundError(
            "No se encontró el retiro del practicante."
        );
    }

    return retiro;
};