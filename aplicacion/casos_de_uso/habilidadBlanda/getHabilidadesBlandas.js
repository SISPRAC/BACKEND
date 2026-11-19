export const getHabilidadesBlandas = async (habilidadBlandaRepository) => {

    const habilidades = await habilidadBlandaRepository.findAll();

    return habilidades;
};