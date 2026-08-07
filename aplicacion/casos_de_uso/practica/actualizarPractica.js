export const actualizarPractica = async ({
    practicaRepository
}, id, data) => {

    const practica = await practicaRepository.findById(id);

    if (!practica) {
        throw new Error("La práctica no existe");
    }

    if (data.periodo_id && data.periodo_id !== practica.periodo_id) {

        const practicaExistente = await practicaRepository.findByPeriodoId(
            data.periodo_id
        );

        if (practicaExistente) {
            throw new Error("El periodo ya tiene una práctica registrada");
        }
    }

    await practicaRepository.update(id, data);

    return await practicaRepository.findById(id);
};