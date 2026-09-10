export const getGruposByPractica = async (
    tutorDocenteRepository,
    usuarioId,
    practicaId
) => {

    const grupos = await tutorDocenteRepository.findGruposByPractica(
        usuarioId,
        practicaId
    );

    return grupos.map(grupo => ({
        id: grupo.id,
        nombre: grupo.nombre,
        estado: grupo.practica?.estado,
        periodo: grupo.practica?.Periodo?.nombre,
        cantidadPracticantes: grupo.candidatosAsignados?.length ?? 0
    }));
};