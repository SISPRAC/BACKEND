import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const deleteGrupo = async (
    grupoRepository,
    candidatoRepository,
    id
) => {

    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError(
            "Grupo no encontrado"
        );
    }

    await candidatoRepository.removerGrupo(id);

    await grupoRepository.delete(id);

    return {
        message: "Grupo eliminado correctamente"
    };
};