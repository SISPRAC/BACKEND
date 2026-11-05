export const getPracticanteById = async (
    PracticanteRepository,
    id
) => {

    const practicante =
        await PracticanteRepository.findById(id);

    return practicante;
};