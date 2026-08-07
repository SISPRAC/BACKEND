export const obtenerPracticas = async ({
    practicaRepository
}) => {

    return await practicaRepository.findByAll();
};