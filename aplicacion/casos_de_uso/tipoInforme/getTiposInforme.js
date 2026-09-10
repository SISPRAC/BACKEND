export const getTiposInforme = async (
    tipoInformeRepository
) => {

    return await tipoInformeRepository.findAll();

};