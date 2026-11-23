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

    // Quitamos repetidos conservando el orden
    const ids = [...new Set(candidatosIds.map(Number))];

    // ── 1 consulta para todos los candidatos (antes: 1 por candidato) ──
    const candidatos = await candidatoRepository.findByIds(ids);
    const candidatoPorId = new Map(
        candidatos.map((c) => [Number(c.id), c])
    );

    // ── 1 consulta para saber quiénes ya tienen postulación activa ──
    const conPostulacionActiva = new Set(
        await postulacionRepository.findActivasByCandidatos(ids)
    );

    // Validaciones (mismos mensajes y mismo orden que antes)
    for (const candidatoId of ids) {

        if (!candidatoPorId.has(candidatoId)) {
            throw new ConflictError(
                `El candidato ${candidatoId} no existe`
            );
        }

        if (conPostulacionActiva.has(candidatoId)) {
            throw new ConflictError(
                `El candidato ${candidatoId} ya tiene una postulación activa`
            );
        }
    }

    // ── 1 solo INSERT para todas las postulaciones ──
    const postulacionesCreadas =
        await postulacionRepository.createMany(
            ids.map((candidatoId) => ({
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId,
                estado: "POSTULADO"
            }))
        );

    const candidatosPostulados = ids.map((id) => candidatoPorId.get(id));

    // Actualizar estado de la apertura (reusa la apertura ya cargada).
    await actualizarEstadoAperturaVacante(
        {
            aperturaVacanteRepository,
            postulacionRepository
        },
        aperturaVacanteId,
        aperturaVacante
    );

    // ── Notificar a la empresa SIN hacer esperar al usuario ──
    // El correo (Brevo) puede tardar varios segundos; la postulación ya
    // quedó guardada, así que se envía en segundo plano.
    notificarPostulacionesEmpresa({
        aperturaVacante,
        candidatos: candidatosPostulados,
        notificacionRepository
    }).catch((error) => {
        console.error(
            "Error notificando nuevas postulaciones a la empresa:",
            error
        );
    });

    return postulacionesCreadas;
};