export const getAperturasByPractica = async (
    {
        tutorEmpresaRepository
    },
    userId,
    practicaId
) => {

    const aperturas =
        await tutorEmpresaRepository.findAperturasByPractica(
            userId,
            practicaId
        );

    return aperturas.map(apertura => ({

        id: apertura.id,

        practica_id: apertura.practica_id,

        periodo: apertura.practica?.Periodo?.nombre,

        fecha_inicio: apertura.practica?.fecha_inicio,

        fecha_fin: apertura.practica?.fecha_fin,

        nombreVacante: apertura.Vacante?.nombre,

        cupos: apertura.cupos,

        estado: apertura.estado,

        practicantes:
            apertura.Postulacions?.map(postulacion => ({

                id: postulacion.id,

                nombre: postulacion.Candidato?.User?.nombres,

                correo: postulacion.Candidato?.User?.correo,

                telefono: postulacion.Candidato?.User?.telefono,

                estado: postulacion.estado

            })) || []

    }));
};