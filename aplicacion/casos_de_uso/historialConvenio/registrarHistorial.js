import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const registrarHistorialConvenio = async (
    historialConvenioRepository,
    data,
    transaction
) => {

    const {
        convenio_id,
        archivo_id,
        accion,
        comentario,
        usuario_id,
        fecha
    } = data;

    // validar datos obligatorios
    if (!convenio_id || !accion || !comentario || !usuario_id) {
        throw new BadRequestError(
            "El convenio, la acción, el comentario y el usuario son obligatorios"
        );
    }

    // crear historial
    const nuevoHistorial =
        await historialConvenioRepository.create(
            {
                convenio_id,
                archivo_id: archivo_id || null,
                accion,
                comentario,
                usuario_id,
                fecha
            },
            transaction
        );

    return {
        nuevoHistorial
    };
};