
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import { notificarRechazoPostulacion } from "../notificarEmail/notificarRechazoPostulacion.js";

export const rechazarPostulacion = async (
    {
        postulacionRepository,
        userRepository,
        notificacionRepository
    },
    postulacionId,
    comentarioEmpresa = null
) => {

    // Validar que se indique el motivo del rechazo.
    if (!comentarioEmpresa || !comentarioEmpresa.trim()) {
        throw new BadRequestError(
            "Debes indicar el motivo del rechazo."
        );
    }

    const postulacion =
        await postulacionRepository.findById(
            postulacionId
        );

    if (!postulacion) {
        throw new ConflictError(
            "La postulación no existe"
        );
    }

    if (postulacion.estado !== "POSTULADO") {
        throw new BadRequestError(
            "La postulación ya fue procesada"
        );
    }

    const [filasActualizadas] =
        await postulacionRepository.update(
            postulacionId,
            {
                estado: "RECHAZADO",
                comentarioEmpresa: comentarioEmpresa.trim(),
                fecha_eleccion: new Date()
            }
        );

    if (filasActualizadas === 0) {
        throw new ConflictError(
            "No fue posible rechazar la postulación"
        );
    }

    // Obtener nuevamente la postulación con sus relaciones.
    const postulacionRechazada =
        await postulacionRepository.findById(
            postulacionId
        );

    // Notificar al director.
    try {

        await notificarRechazoPostulacion({
            postulacion: postulacionRechazada,
            userRepository,
            notificacionRepository
        });

    } catch (error) {

        console.error(
            "Error notificando el rechazo de la postulación:",
            error
        );

    }

    return postulacionRechazada;
};
