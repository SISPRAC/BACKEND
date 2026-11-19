export const obtenerTutoresEmpresarialesSolicitudVisita = async (
    solicitudVisitaRepository,
    postulacionRepository,
    solicitudId
) => {

    const solicitud =
        await solicitudVisitaRepository.findByIdWithDetails(solicitudId);

    const practicantes =
        await solicitudVisitaRepository
            .findPracticantesWithDetailsBySolicitudId(solicitudId);

    const tutores = new Map();
    const nombresPracticantes = [];

    for (const item of practicantes) {

        const practicaPracticante = item.practicaPracticante;
        const candidato = practicaPracticante?.practicante?.candidato;

        if (!candidato) continue;

        const usuarioPracticante = candidato.Usuario;

        const nombre = usuarioPracticante
            ? `${usuarioPracticante.nombres} ${usuarioPracticante.apellidos}`.trim()
            : null;

        if (nombre) nombresPracticantes.push(nombre);

        const postulacion =
            await postulacionRepository.findAceptadaByCandidatoYPractica(
                candidato.id,
                practicaPracticante.practica_id
            );

        const usuarioTutor =
            postulacion?.AperturaVacante?.TutorEmpresa?.Usuario;

        if (!usuarioTutor) continue;

        if (!tutores.has(usuarioTutor.id)) {
            tutores.set(usuarioTutor.id, {
                usuarioTutor,
                nombresPracticantes: []
            });
        }

        if (nombre) {
            tutores.get(usuarioTutor.id).nombresPracticantes.push(nombre);
        }
    }

    return {
        tutores: [...tutores.values()],
        nombresPracticantes,
        nombreEmpresa: solicitud?.empresa?.nombre ?? "la empresa"
    };
};