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

    const resultado = aperturas.map(apertura => ({

        id: apertura.id,

        practica_id: apertura.practica_id,

        periodo: apertura.practica?.Periodo?.nombre,

        fecha_inicio: apertura.practica?.fecha_inicio,

        fecha_fin: apertura.practica?.fecha_fin,

        nombreVacante: apertura.Vacante?.nombre,

        cupos: apertura.cupos,

        estado: apertura.estado,

        practicantes: (() => {

            const practicantesMap = new Map();

            apertura.Postulacions?.forEach(postulacion => {

                const practicante =
                    postulacion.Candidato?.practicante;

                const practicaPracticante =
                    practicante?.practicas?.[0];

                if (!practicante || !practicaPracticante) {
                    return;
                }

                practicantesMap.set(
                    practicante.id,
                    {
                        id_practicante:
                            practicante.id,

                        nombre:
                            postulacion.Candidato?.Usuario?.nombres +
                            " " +
                            postulacion.Candidato?.Usuario?.apellidos,

                        correo:
                            postulacion.Candidato?.Usuario?.correo,

                        telefono:
                            postulacion.Candidato?.Usuario?.telefono,

                        estado:
                            practicaPracticante.estado
                    }
                );
            });

            return Array.from(practicantesMap.values());

        })()

    }));

    return resultado;
};