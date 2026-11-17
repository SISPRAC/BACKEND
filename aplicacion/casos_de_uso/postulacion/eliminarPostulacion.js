
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import { actualizarEstadoAperturaVacante } from "../aperturaVacante/actualizarEstadoAperturaVacante.js";

import { notificarRetiroPostulacionEmpresa } from "../notificarEmail/notificarRetiroPostulacion.js";

export const eliminarPostulacion = async (
    {
        postulacionRepository,
        aperturaVacanteRepository,
        notificacionRepository
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

    // Eliminar postulación.
    const filasEliminadas =
        await postulacionRepository.delete(
            postulacion.id
        );

    if (filasEliminadas === 0) {
        throw new ConflictError(
            "No fue posible eliminar la postulación"
        );
    }

    // Actualizar estado de la apertura.
    await actualizarEstadoAperturaVacante(
        {
            aperturaVacanteRepository,
            postulacionRepository
        },
        aperturaVacanteId
    );

    // Notificar únicamente a la empresa.
    try {

        await notificarRetiroPostulacionEmpresa({
            postulacion,
            notificacionRepository
        });

    } catch (error) {

        console.error(
            "Error notificando el retiro de la postulación a la empresa:",
            error
        );

    }

    return {
        message: "Postulación eliminada correctamente"
    };
};
