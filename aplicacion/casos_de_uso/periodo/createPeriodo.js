import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const crearPeriodo = async (
    periodoRepository,
    data
) => {
 
    const { nombre, fecha_inicio, fecha_fin } = data;

    if (!nombre || !fecha_inicio || !fecha_fin) {
        throw new BadRequestError(
            "Nombre, fecha de inicio y fecha de fin son requeridos"
        );
    }

    // validar formato
    if (!/^[0-9-]+$/.test(nombre)) {
        throw new BadRequestError(
            "El nombre solo puede contener números y guiones"
        );
    }

    if (!/^\d{4}-\d{2,3}$/.test(nombre)) {
   throw new BadRequestError(
      "El periodo debe tener formato 0000-000"
   );
}

    const exist = await periodoRepository.findByName(nombre);

    if (exist) {
        throw new ConflictError(
            "Ya existe un periodo con ese nombre"
        );
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (inicio.getTime() === fin.getTime()) {
        throw new BadRequestError(
            "La fecha inicial no puede ser igual a la fecha final"
        );
    }

    if (fin < inicio) {
        throw new BadRequestError(
            "La fecha final no puede ser menor que la fecha inicial"
        );
    }

    const newPeriodo = await periodoRepository.create({
        nombre,
        fecha_inicio,
        fecha_fin
    });

    return { newPeriodo };
};