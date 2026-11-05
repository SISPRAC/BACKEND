import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerPracticaRequisitoDocumentoPorId = async (
    {
        practicaRequisitoDocumentoSubidoRepository,
    },
    id
) => {
    if (!id) {
        throw new BadRequestError(
            "El identificador del documento es obligatorio."
        );
    }

    const documento =
        await practicaRequisitoDocumentoSubidoRepository.findById(id);

    if (!documento) {
        throw new NotFoundError(
            "No se encontró el documento entregado."
        );
    }

    return documento;
};