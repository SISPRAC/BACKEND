import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const eliminarGrupo = async (
    grupoRepository,
    grupoCandidatoRepository,
    id
) => {

    // Buscar grupo
    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError(
            "El grupo no existe"
        );
    }

    // Verificar si el grupo tiene practicantes
    const tienePracticantes =
        await grupoRepository.tienePracticantes(id);

    if (tienePracticantes) {
        throw new ConflictError(
            "No se puede eliminar el grupo porque tiene practicantes asignados"
        );
    }

    // Eliminar relaciones GrupoCandidato
    await grupoCandidatoRepository.deleteByGrupo(id);

    // Eliminar grupo
    await grupoRepository.delete(id);

    return {
        message: "Grupo eliminado correctamente"
    };
};