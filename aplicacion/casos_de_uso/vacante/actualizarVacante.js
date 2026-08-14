import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const actualizarVacante = async (
    {
        empresaRepository,
        vacanteRepository
    },
    usuarioId,
    vacanteId,
    data
) => {

    const empresa =
        await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró la empresa asociada al usuario"
        );
    }

    const vacante =
        await vacanteRepository.findByIdAndEmpresa(
            vacanteId,
            empresa.id
        );

    if (!vacante) {
        throw new NotFoundError(
            "No se encontró la vacante o no pertenece a la empresa"
        );
    }

    if (data.convenio_id !== undefined) {
        throw new BadRequestError(
            "El convenio de una vacante no puede ser modificado"
        );
    }

    if (
        data.cantidad !== undefined &&
        (!Number.isInteger(data.cantidad) || data.cantidad <= 0)
    ) {
        throw new BadRequestError(
            "La cantidad de cupos debe ser un número entero mayor que cero"
        );
    }

    const datosActualizar = {};

    if (data.nombre !== undefined) {
        datosActualizar.nombre = data.nombre;
    }

    if (data.descripcion !== undefined) {
        datosActualizar.descripcion = data.descripcion;
    }

    if (data.cantidad !== undefined) {
        datosActualizar.cantidad = data.cantidad;
    }

    if (data.estado !== undefined) {

        if (!["DISPONIBLE", "CERRADA"].includes(data.estado)) {
            throw new BadRequestError(
                "El estado de la vacante no es válido"
            );
        }

        datosActualizar.estado = data.estado;
    }

    if (Object.keys(datosActualizar).length === 0) {
        throw new BadRequestError(
            "No se proporcionaron datos para actualizar"
        );
    }

    return await vacanteRepository.update(
        vacanteId,
        datosActualizar
    );
};