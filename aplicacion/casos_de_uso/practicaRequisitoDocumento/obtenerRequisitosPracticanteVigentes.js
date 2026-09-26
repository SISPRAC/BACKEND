export const obtenerRequisitosPracticanteVigentes = async (
    practicaRequisitoDocumentoRepository,
    user_id
) => {

    return await practicaRequisitoDocumentoRepository
        .findRequisitosPracticanteVigentes(
            user_id
        );

};