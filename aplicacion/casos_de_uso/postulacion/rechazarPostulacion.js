import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const rechazarPostulacion = async (
    {
        postulacionRepository
    },
    postulacionId,
    comentarioEmpresa = null
) => {

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
                comentarioEmpresa,
                fecha_eleccion: new Date()
            }
        );

    if (filasActualizadas === 0) {
        throw new ConflictError(
            "No fue posible rechazar la postulación"
        );
    }

    return await postulacionRepository.findById(
        postulacionId
    );
};