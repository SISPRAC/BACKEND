export const getPeriodos = async (periodoRepository) => {

    const periodos = await periodoRepository.findAll();

    return periodos;
};