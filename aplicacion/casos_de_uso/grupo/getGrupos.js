export const getGrupos = async (grupoRepository) => {

    const grupos = await grupoRepository.findAll();

    return grupos;
};