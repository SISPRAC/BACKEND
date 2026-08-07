import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const update = async (
    periodoRepository,
    id,
    data
) => {

    // buscar el periodo actual
    const periodo = await periodoRepository.findById(id);

    const exist = await periodoRepository.findByName(data.nombre);

    if (exist && exist.id !== Number(id)) {
        throw new ConflictError(
            "Ya existe un periodo con ese nombre"
        );
    }

    if (!periodo) {
        throw new BadRequestError("Periodo no encontrado");
    }

    // actualizar campos
    const updatedData = {
        nombre: data.nombre || periodo.nombre,
        fecha_inicio: data.fecha_inicio || periodo.fecha_inicio,
        fecha_fin: data.fecha_fin || periodo.fecha_fin
    };

    // guardar cambios
    await periodoRepository.update(id, updatedData);

    // retornar objeto actualizado
    return {
        ...periodo.toJSON(),
        ...updatedData
    };
};
