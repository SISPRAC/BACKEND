import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getPeriodo = async (periodoRepository, id) => {

    const periodo = await periodoRepository.findById(id);

    if (!periodo) {
        throw new BadRequestError("Periodo no encontrado");
    }

    return periodo;
};