export const obtenerRetirosPorPracticante = async (
    retiroPracticanteRepository,
    practicanteId
) => {

    return await retiroPracticanteRepository.findByPracticanteId(
        practicanteId
    );

};