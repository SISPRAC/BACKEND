export const getRequisitosConvenio = async (
    tipoRequisitoDocumentoRepository,
    tipo_empresa
) => {

    return await tipoRequisitoDocumentoRepository.findRequisitosConvenio(
        tipo_empresa
    );

};