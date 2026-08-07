export const crearPractica = async ({
    practicaRepository,
    periodoRepository
}, data) => {

    const periodo = await periodoRepository.findById(data.periodo_id);

    if (!periodo) {
        throw new Error("El periodo no existe");
    }

    const practicaExistente = await practicaRepository.findByPeriodoId(
        data.periodo_id
    );

    if (practicaExistente) {
        throw new Error("El periodo ya tiene una práctica registrada");
    }

    return await practicaRepository.create(data);
};