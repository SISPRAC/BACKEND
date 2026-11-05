
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerDocumentosPracticantePorPractica = async (
    {
        practicaRequisitoDocumentoSubidoRepository,
    },
    usuario_id,
    practica_id
) => {
    if (!usuario_id) {
        throw new BadRequestError("El usuario es obligatorio.");
    }

    if (!practica_id) {
        throw new BadRequestError("La práctica es obligatoria.");
    }

    const usuarioId = Number(usuario_id);
    const practicaId = Number(practica_id);

    if (
        !Number.isInteger(usuarioId) ||
        usuarioId <= 0
    ) {
        throw new BadRequestError("El usuario no es válido.");
    }

    if (
        !Number.isInteger(practicaId) ||
        practicaId <= 0
    ) {
        throw new BadRequestError("La práctica no es válida.");
    }

    return await practicaRequisitoDocumentoSubidoRepository.findByUsuarioYPractica(
        usuarioId,
        practicaId
    );
};
