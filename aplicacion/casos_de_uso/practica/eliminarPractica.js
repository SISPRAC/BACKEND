import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const eliminarPractica = async ({
    practicaRepository
}, id) => {

    // Verificar si la práctica existe
    const practica = await practicaRepository.findById(id);

    if (!practica) {
        throw new NotFoundError("La práctica no existe");
    }

    // Verificar si tiene practicantes asociados
    const cantidadPracticaPracticantes =
        await practicaRepository.tienePracticaPracticantes(id);

    if (cantidadPracticaPracticantes > 0) {
        throw new ConflictError(
            "No se puede eliminar la práctica porque tiene practicantes asociados"
        );
    }

    // Verificar si tiene grupos asociados
    const cantidadGrupos =
        await practicaRepository.tieneGrupos(id);

    if (cantidadGrupos > 0) {
        throw new ConflictError(
            "No se puede eliminar la práctica porque tiene grupos asociados"
        );
    }

    // Eliminar práctica
    await practicaRepository.delete(id);

    return {
        message: "Práctica eliminada correctamente"
    };
};