import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getPracticaInforme = async (
    practicaInformeRepository,
    id
) => {

    const informe =
        await practicaInformeRepository.findById(id);

    if (!informe) {

        throw new NotFoundError(
            "El informe de práctica no existe."
        );

    }

    return informe;
};