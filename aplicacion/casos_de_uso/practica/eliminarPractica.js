export const eliminarPractica = async ({
    practicaRepository
}, id) => {

    const practica = await practicaRepository.findById(id);

    if (!practica) {
        throw new Error("La práctica no existe");
    }

    const cantidadPracticaPracticantes =
        await practicaRepository.tienePracticaPracticantes(id);

    if (cantidadPracticaPracticantes > 0) {
        throw new Error(
            "No se puede eliminar la práctica porque tiene practicantes asociados"
        );
    }

    await practicaRepository.delete(id);

    return {
        message: "Práctica eliminada correctamente"
    };
};