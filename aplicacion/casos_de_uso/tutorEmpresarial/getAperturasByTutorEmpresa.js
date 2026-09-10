export const getAperturasByTutorEmpresa = async (
    {
        tutorEmpresaRepository
    },
    userId,
    periodoId,
    practicaId
) => {

    const aperturas =
        await tutorEmpresaRepository.findAperturasByTutorEmpresa(
            userId,
            periodoId,
            practicaId
        );

    const agrupadas = {};

    aperturas.forEach(apertura => {

        const practica = apertura.practica;

        if (!agrupadas[apertura.practica_id]) {

            agrupadas[apertura.practica_id] = {
                practica_id: apertura.practica_id,

                periodo: practica?.Periodo?.nombre,

                fecha_inicio: practica?.fecha_inicio,

                fecha_fin: practica?.fecha_fin,

                estado: practica?.estado,

                cantidadAperturas: 0,

                cantidadPracticantes: 0
            };
        }

        agrupadas[apertura.practica_id].cantidadAperturas++;

        agrupadas[apertura.practica_id].cantidadPracticantes +=
            apertura.Postulacions?.filter(
                postulacion => postulacion.estado === "ACEPTADO"
            ).length || 0;
    });

    return Object.values(agrupadas);
};