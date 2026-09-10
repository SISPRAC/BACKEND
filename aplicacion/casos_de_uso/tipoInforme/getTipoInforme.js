import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getTipoInforme = async (
    tipoInformeRepository,
    id
) => {

    const tipoInforme =
        await tipoInformeRepository.findById(id);

    if (!tipoInforme) {

        throw new NotFoundError(
            "El tipo de informe no existe."
        );

    }

    return tipoInforme;
};