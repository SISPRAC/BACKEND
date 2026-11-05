export const obtenerRequisitosEmpresaVigentes = async (
    practicaRequisitoDocumentoRepository,
    user_id
) => {

    return await practicaRequisitoDocumentoRepository
        .findRequisitosEmpresaVigentes(
            user_id
        );
};