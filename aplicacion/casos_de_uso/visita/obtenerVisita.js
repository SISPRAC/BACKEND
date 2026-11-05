import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerVisita = async (
    { visitaRepository },
    visitaId
) => {
    const visita = await visitaRepository.findByIdWithArchivos(
        visitaId
    );

    if (!visita) {
        throw new NotFoundError("La visita no existe");
    }

    return visita;
};
