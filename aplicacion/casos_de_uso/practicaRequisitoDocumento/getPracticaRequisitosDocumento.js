export const getPracticaRequisitosDocumento = async (
    practicaRequisitoDocumentoRepository,
    practica_id
) => {
    return await practicaRequisitoDocumentoRepository.findByPracticaId(
        practica_id
    );
};