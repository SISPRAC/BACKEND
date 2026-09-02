export const getAperturasVacantes = async (
    aperturaVacanteRepository
) => {

    return await aperturaVacanteRepository.findAll();

};