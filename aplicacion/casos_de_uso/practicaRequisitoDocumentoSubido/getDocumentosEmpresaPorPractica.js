export const getDocumentosEmpresaPorPractica = async (
    { practicaRequisitoDocumentoSubidoRepository },
    usuario_id,
    practica_id
) => {
    return await practicaRequisitoDocumentoSubidoRepository
        .findByUsuarioYPracticaEmpresa(usuario_id, practica_id);
};