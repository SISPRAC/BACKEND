import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerSolicitudesVisitaTutorDocente = async (
    {
        tutorDocenteRepository,
        solicitudVisitaRepository
    },
    userId
) => {

    const tutorDocente =
        await tutorDocenteRepository.findByUserId(
            userId
        );

    if (!tutorDocente) {
        throw new NotFoundError(
            "No se encontró el tutor docente asociado al usuario"
        );
    }

    const solicitudes =
        await solicitudVisitaRepository
            .findByTutorDocenteWithDetails(
                tutorDocente.id
            );

    return solicitudes;
};