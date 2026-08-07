import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { actualizarEstadoAperturaVacante } from "./actualizarEstadoAperturaVacante.js";

export const actualizarAperturaVacante = async (
    {
        aperturaVacanteRepository,
        postulacionRepository
    },
    id,
    datos
) => {

    const aperturaVacante =
        await aperturaVacanteRepository.findById(id);

    if (!aperturaVacante) {
        throw new ConflictError(
            "La apertura de vacante no existe"
        );
    }

    if (
        datos.cupos !== undefined &&
        (!Number.isInteger(datos.cupos) || datos.cupos < 0)
    ) {
        throw new BadRequestError(
            "Los cupos deben ser un número entero mayor o igual a cero"
        );
    }

    const cuposOcupados =
        await postulacionRepository.countByAperturaVacante(id);

    if (
        datos.cupos !== undefined &&
        datos.cupos < cuposOcupados
    ) {
        throw new BadRequestError(
            `No es posible asignar ${datos.cupos} cupos porque ya existen ${cuposOcupados} postulaciones`
        );
    }

    const dataActualizar = {};

    if (datos.cupos !== undefined) {
        dataActualizar.cupos = datos.cupos;
    }

    if (datos.periodo_id !== undefined) {
        dataActualizar.periodo_id = datos.periodo_id;
    }

    await aperturaVacanteRepository.update(
        id,
        dataActualizar
    );

    await actualizarEstadoAperturaVacante(
        {
            aperturaVacanteRepository,
            postulacionRepository
        },
        id
    );

    return {
        message: "Apertura de vacante actualizada correctamente"
    };
};