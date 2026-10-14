import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerVisitasPorPracticante = async (
    { visitaRepository },
    practicanteId
) => {

    if (
        !practicanteId ||
        isNaN(Number(practicanteId))
    ) {
        throw new Error(
            "El ID del practicante no es válido."
        );
    }

    const id = Number(practicanteId);

    // Primera consulta: obtener las visitas relacionadas con el practicante
    const visitas =
        await visitaRepository.findByPracticanteId(id);

    if (!visitas || visitas.length === 0) {
        throw new NotFoundError(
            "No se encontraron visitas asociadas a este practicante."
        );
    }

    // Consultar los detalles de cada solicitud asociada a las visitas
    const visitasConDetalles = await Promise.all(
        visitas.map(async (visita) => {

            const visitaJSON = visita.toJSON();

            const solicitud =
                await visitaRepository.findSolicitudVisitaDetails(
                    visitaJSON.solicitud_visita_id
                );

            if (!solicitud) {
                return {
                    ...visitaJSON,
                    empresa: null,
                    practicantes: [],
                    responsable: null
                };
            }

            return {
                ...visitaJSON,
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
        })
    );

    return visitasConDetalles;
};
