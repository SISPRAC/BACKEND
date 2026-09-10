export const getTiposRequisitoDocumento = async (
    tipoRequisitoDocumentoRepository
) => {

    return await tipoRequisitoDocumentoRepository.findAll();

};