import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getTipoRequisitoDocumento = async (
    tipoRequisitoDocumentoRepository,
    id
) => {

    const tipo =
        await tipoRequisitoDocumentoRepository.findById(id);

    if (!tipo) {

        throw new NotFoundError(
            "El tipo de requisito documental no existe."
        );

    }

    return tipo;
};