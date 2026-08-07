import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const deletePeriodo = async (periodoRepository, id) => {

    // buscar si existe
    const periodo = await periodoRepository.findById(id);

    const registrosRelacionados = await periodoRepository.estaEnUso(id);

    if (registrosRelacionados > 0) {
        throw new BadRequestError(
            "El período está siendo utilizado"
        );
    }

    if (!periodo) {
        throw new BadRequestError("Periodo no encontrado");
    }

    // eliminar
    await periodoRepository.delete(id);

    return {
        message: "Periodo eliminado correctamente"
    };
};