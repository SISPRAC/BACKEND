export const getPlantillasEncuesta = async (
    plantillaEncuestaRepository
) => {

    return await plantillaEncuestaRepository.findAll();
};