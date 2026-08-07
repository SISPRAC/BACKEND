import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { actualizarEstadoAperturaVacante } from "../aperturaVacante/actualizarEstadoAperturaVacante.js";

export const registrarPostulaciones = async (
    {
        postulacionRepository,
        candidatoRepository,
        aperturaVacanteRepository
    },
    aperturaVacanteId,
    candidatosIds
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

    if (aperturaVacante.estado === "CERRADA") {
        throw new BadRequestError(
            "La apertura de vacante se encuentra cerrada"
        );
    }

    if (aperturaVacante.estado === "OCUPADA") {
        throw new BadRequestError(
            "La apertura de vacante no tiene cupos disponibles"
        );
    }

    const cuposOcupados =
        await postulacionRepository.countByAperturaVacante(
            aperturaVacanteId
        );

    const cuposDisponibles =
        aperturaVacante.cupos - cuposOcupados;

    if (candidatosIds.length > cuposDisponibles) {
        throw new BadRequestError(
            `Solo hay ${cuposDisponibles} cupos disponibles`
        );
    }

    const postulacionesCreadas = [];

    for (const candidatoId of candidatosIds) {

        const candidato =
            await candidatoRepository.findById(candidatoId);

        if (!candidato) {
            throw new ConflictError(
                `El candidato ${candidatoId} no existe`
            );
        }

        const existe =
            await postulacionRepository.findByCandidatoAndApertura(
                candidatoId,
                aperturaVacanteId
            );

        if (existe) {
            throw new ConflictError(
                `El candidato ${candidato.nombre} ya se encuentra postulado`
            );
        }

        const postulacion =
            await postulacionRepository.create({
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId,
                estado: "POSTULADO"
            });

        postulacionesCreadas.push(postulacion);
    }

    await actualizarEstadoAperturaVacante(
        {
            aperturaVacanteRepository,
            postulacionRepository
        },
        aperturaVacanteId
    );

    return postulacionesCreadas;
};