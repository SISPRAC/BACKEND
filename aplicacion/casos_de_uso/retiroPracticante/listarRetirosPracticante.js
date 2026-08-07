export const listarRetirosPracticante = async (
    retiroPracticanteRepository
) => {

    return await retiroPracticanteRepository.findAll();

};