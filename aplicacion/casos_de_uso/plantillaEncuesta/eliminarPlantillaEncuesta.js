import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const eliminarPlantillaEncuesta = async (
    plantillaEncuestaRepository,
    practicaEncuestaRepository,
    id
) => {

    const plantilla =
        await plantillaEncuestaRepository.findById(id);

    if (!plantilla) {

        throw new NotFoundError(
            "La plantilla de encuesta no existe"
        );

    }

    const usos =
        await practicaEncuestaRepository.countByPlantilla(
            id
        );

    if (usos > 0) {

        throw new ConflictError(
            "No se puede eliminar la plantilla porque ya fue utilizada en una práctica"
        );

    }

    await plantillaEncuestaRepository.delete(id);

    return {
        message: "Plantilla de encuesta eliminada correctamente"
    };
};