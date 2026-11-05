import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getEntregaInformeByPracticante = async (
    entregaInformeRepository,
    practicante_id,
    tipo_requisito_documento_id
) => {

    // ============================================================
    // BUSCAR ENTREGA DEL PRACTICANTE
    // ============================================================

    const entregas =
        await entregaInformeRepository
            .findByPracticanteAndTipoRequisito(
                practicante_id,
                tipo_requisito_documento_id
            );

    if (!entregas || entregas.length === 0) {

        throw new NotFoundError(
            "El practicante no tiene entregas para este documento."
        );

    }

    return entregas;
};