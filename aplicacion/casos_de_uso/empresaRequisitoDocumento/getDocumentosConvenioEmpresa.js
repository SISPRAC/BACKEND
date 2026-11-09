export const getDocumentosConvenioEmpresa = async (
    empresaRequisitoDocumentoRepository,
    empresa_id
) => {

    return await empresaRequisitoDocumentoRepository.findByEmpresa(
        empresa_id
    );

};