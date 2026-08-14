export const getAperturasVacantes = async (
    vacanteRepository
) => {

    const aperturas =
        await vacanteRepository.findAperturas();

    return aperturas;
};