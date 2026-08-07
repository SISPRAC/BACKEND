import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { actualizarEstadoAperturaVacante } from "../aperturaVacante/actualizarEstadoAperturaVacante.js";

export const eliminarPostulacion = async (
    {
        postulacionRepository,
        aperturaVacanteRepository
    },
    candidatoId,
    aperturaVacanteId
) => {

    const postulacion =
        await postulacionRepository.findByCandidatoAndApertura(
            candidatoId,
            aperturaVacanteId
        );

    if (!postulacion) {
        throw new ConflictError(
            "La postulación no existe"
        );
    }

    await postulacionRepository.delete(
        postulacion.id
    );

    await actualizarEstadoAperturaVacante(
        {
            aperturaVacanteRepository,
            postulacionRepository
        },
        aperturaVacanteId
    );

    return {
        message: "Postulación eliminada correctamente"
    };
};