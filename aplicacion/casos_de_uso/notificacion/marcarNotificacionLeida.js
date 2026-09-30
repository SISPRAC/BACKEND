import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const marcarNotificacionLeida = async (
    { notificacionRepository },
    notificacionId,
    user_id
) => {

    const notificacion =
        await notificacionRepository.findById(
            notificacionId
        );

    if (!notificacion) {
        throw new NotFoundError(
            "La notificación no existe."
        );
    }

    if (notificacion.usuario_id !== user_id) {
        throw new NotFoundError(
            "La notificación no existe."
        );
    }

    if (notificacion.estado === "LEIDA") {
        return notificacion;
    }

    return await notificacionRepository.marcarLeida(
        notificacionId
    );
};