import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import { actualizarEstadoAperturaVacante } from "../aperturaVacante/actualizarEstadoAperturaVacante.js";

import { notificarPostulacionesEmpresa } from "../notificarEmail/notificarPostulacionesEmpresa.js";

export const registrarPostulaciones = async (
    {
        postulacionRepository,
        candidatoRepository,
        aperturaVacanteRepository,
        notificacionRepository
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

    // Guardaremos los candidatos para construir la notificación.
    const candidatosPostulados = [];

    for (const candidatoId of candidatosIds) {

        const candidato =
            await candidatoRepository.findById(
                candidatoId
            );

        if (!candidato) {
            throw new ConflictError(
                `El candidato ${candidatoId} no existe`
            );
        }

        // Validar postulación activa global.
        const postulacionActiva =
            await postulacionRepository
                .findPostulacionActivaByCandidato(
                    candidatoId
                );

        if (postulacionActiva) {
            throw new ConflictError(
                `El candidato ${candidatoId} ya tiene una postulación activa`
            );
        }

        // Crear postulación.
        const postulacion =
            await postulacionRepository.create({
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId,
                estado: "POSTULADO"
            });

        postulacionesCreadas.push(postulacion);

        // Guardar candidato con sus datos de usuario.
        candidatosPostulados.push(candidato);
    }

    // Actualizar estado de la apertura.
    await actualizarEstadoAperturaVacante(
        {
            aperturaVacanteRepository,
            postulacionRepository
        },
        aperturaVacanteId
    );

    // Notificar a la empresa.
    try {

        await notificarPostulacionesEmpresa({
            aperturaVacante,
            candidatos: candidatosPostulados,
            notificacionRepository
        });

    } catch (error) {
        console.error(
            "Error notificando nuevas postulaciones a la empresa:",
            error
        );
    }

    return postulacionesCreadas;
};