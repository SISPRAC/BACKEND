export const getPracticantes = async (PracticanteRepository) => {

    const practicantes = await PracticanteRepository.findByAll();

    return practicantes;
};