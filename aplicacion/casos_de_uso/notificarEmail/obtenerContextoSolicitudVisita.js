export const obtenerContextoSolicitudVisita = async (
    solicitudVisitaRepository,
    solicitudId
) => {

    const solicitud =
        await solicitudVisitaRepository.findByIdWithDetails(solicitudId);

    const practicantes =
        await solicitudVisitaRepository
            .findPracticantesWithDetailsBySolicitudId(solicitudId);

    const nombresPracticantes = practicantes
        .map((item) => {
            const usuario =
                item.practicaPracticante?.practicante?.candidato?.Usuario;

            return usuario
                ? `${usuario.nombres} ${usuario.apellidos}`.trim()
                : null;
        })
        .filter(Boolean);

    const nombreEmpresa =
        solicitud?.empresa?.nombre ?? "la empresa";

    return { nombresPracticantes, nombreEmpresa };
};