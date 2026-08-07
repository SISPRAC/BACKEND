export const obtenerPracticaPorId = async ({
    practicaRepository
}, id) => {

    const practica = await practicaRepository.findById(id);

    if (!practica) {
        throw new Error("La práctica no existe");
    }

    return practica;
};