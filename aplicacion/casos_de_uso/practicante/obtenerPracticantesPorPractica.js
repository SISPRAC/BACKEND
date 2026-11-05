export const obtenerPracticantesPorPractica = async (
    practicanteRepository,
    practicaId
) => {

    const practicantes =
        await practicanteRepository.findByPracticaId(practicaId);

    return practicantes;
};

