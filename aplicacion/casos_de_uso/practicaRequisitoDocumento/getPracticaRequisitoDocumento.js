import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    id
) => {

    const requisito =
        await practicaRequisitoDocumentoRepository.findById(id);

    if (!requisito) {

        throw new NotFoundError(
            "El requisito documental no existe."
        );

    }

    return requisito;
};