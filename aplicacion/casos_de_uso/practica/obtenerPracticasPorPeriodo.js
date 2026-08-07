export const obtenerPracticaPorPeriodo = async ({
    practicaRepository,
    periodoRepository
}, periodo_id) => {

    const periodo = await periodoRepository.findById(periodo_id);

    if (!periodo) {
        throw new Error("El periodo no existe");
    }

    const practica = await practicaRepository.findByPeriodoId(periodo_id);

    if (!practica) {
        throw new Error("El periodo no tiene una práctica registrada");
    }

    return practica;
};