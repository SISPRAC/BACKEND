import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerEstadoPracticaRequisitoDocumento = async (
    {
        practicaRequisitoDocumentoSubidoRepository,
    },
    usuario_id
) => {
    if (!usuario_id) {
        throw new BadRequestError("El usuario es obligatorio.");
    }

    return await practicaRequisitoDocumentoSubidoRepository.findByUsuarioId(
        usuario_id
    );
};