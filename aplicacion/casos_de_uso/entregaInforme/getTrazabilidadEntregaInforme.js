import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getTrazabilidadEntregaInforme = async (
    entregaInformeRepository,
    practicaRequisitoDocumentoRepository,
    user_id,
    practica_requisito_documento_id
) => {

    // ============================================================
    // BUSCAR REQUISITO
    // ============================================================

    const requisito =
        await practicaRequisitoDocumentoRepository.findById(
            practica_requisito_documento_id
        );

    if (!requisito) {
        throw new NotFoundError(
            "El requisito de documento no existe."
        );
    }


    // ============================================================
    // VALIDAR QUE EL REQUISITO PERTENEZCA AL PRACTICANTE
    // AUTENTICADO
    // ============================================================

    const practicaPracticante =
        await entregaInformeRepository
            .findPracticaPracticanteByUserIdAndPracticaId(
                user_id,
                requisito.practica_id
            );

    if (!practicaPracticante) {
        throw new NotFoundError(
            "No tiene acceso a la trazabilidad de este documento."
        );
    }


    // ============================================================
    // OBTENER TODAS LAS VERSIONES
    // ============================================================

    const entregas =
        await entregaInformeRepository
            .findByPracticaPracticanteAndRequisito(
                practicaPracticante.id,
                practica_requisito_documento_id
            );

    return entregas;
};