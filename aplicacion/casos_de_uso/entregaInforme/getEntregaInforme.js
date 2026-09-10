import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getEntregaInforme = async (
    entregaInformeRepository,
    id
) => {

    const entrega =
        await entregaInformeRepository.findById(id);

    if (!entrega) {

        throw new NotFoundError(
            "La entrega del informe no existe."
        );

    }

    return entrega;

};