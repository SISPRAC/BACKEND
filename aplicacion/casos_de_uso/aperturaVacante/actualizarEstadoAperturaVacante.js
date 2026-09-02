import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const actualizarEstadoAperturaVacante = async (
    {
        aperturaVacanteRepository,
        postulacionRepository
    },
    aperturaVacanteId
) => {

    const aperturaVacante =
        await aperturaVacanteRepository.findById(
            aperturaVacanteId
        );

    if (!aperturaVacante) {
        throw new ConflictError(
            "La apertura de vacante no existe"
        );
    }

    const cuposOcupados =
        await postulacionRepository.countByAperturaVacante(
            aperturaVacanteId
        );

    let estado = "DISPONIBLE";

    const hoy = new Date();

    if (
        aperturaVacante.Periodo &&
        new Date(aperturaVacante.Periodo.fecha_fin) < hoy
    ) {
        estado = "CERRADA";
    }
    else if (
        cuposOcupados >= aperturaVacante.cupos
    ) {
        estado = "OCUPADA";
    }

    await aperturaVacanteRepository.update(
        aperturaVacanteId,
        { estado }
    );

    return {
        aperturaVacanteId,
        estado,
        cuposTotales: aperturaVacante.cupos,
        cuposOcupados,
        cuposDisponibles: Math.max(
            0,
            aperturaVacante.cupos - cuposOcupados
        )
    };
};