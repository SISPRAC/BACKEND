import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerVisitaPorSolicitud = async (
    { visitaRepository },
    solicitudVisitaId
) => {

    if (
        !solicitudVisitaId ||
        isNaN(Number(solicitudVisitaId))
    ) {
        throw new Error(
            "El ID de la solicitud de visita no es válido."
        );
    }

    const id = Number(solicitudVisitaId);

    // Primera consulta: visita y evidencias
    const visita =
        await visitaRepository.findBySolicitudVisitaId(id);

    if (!visita) {
        throw new NotFoundError(
            "No se encontró una visita asociada a esta solicitud."
        );
    }

    // Segunda consulta: empresa, practicantes y responsable
    const solicitud =
        await visitaRepository.findSolicitudVisitaDetails(id);

    if (!solicitud) {
        throw new NotFoundError(
            "No se encontró la solicitud de visita asociada."
        );
    }

    // Unificar los resultados
    return {
        ...visita.toJSON(),
        empresa: solicitud.empresa ?? null,
        practicantes: solicitud.practicantes ?? [],
        responsable: solicitud.tutorDocente?.Usuario
            ? {
                id: solicitud.tutorDocente.Usuario.id,
                nombres: solicitud.tutorDocente.Usuario.nombres,
                apellidos: solicitud.tutorDocente.Usuario.apellidos
            }
            : null
    };
};