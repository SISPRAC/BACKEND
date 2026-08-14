export const getPlantillasEncuesta = async (
    plantillaEncuestaRepository
) => {

    const plantillas =
        await plantillaEncuestaRepository.findAll();

    return plantillas.map(plantilla => {

        const practicas =
            plantilla.practicas || [];

        // Total de aplicaciones
        const aplicaciones =
            practicas.length;

        // Total de respuestas
        const respuestas =
            practicas.reduce(
                (total, practicaEncuesta) => {

                    return total +
                        (
                            practicaEncuesta.respuestas?.length || 0
                        );

                },
                0
            );

        // Total de preguntas
        const preguntas =
            plantilla.preguntas?.length || 0;

        return {

            id:
                plantilla.id,

            titulo:
                plantilla.titulo,

            descripcion:
                plantilla.descripcion,

            rol:
                plantilla.Role?.nombre ||
                "Sin rol",

            preguntas,

            practicas:
                practicas.map(
                    practicaEncuesta => ({

                        id:
                            practicaEncuesta.practica?.id,

                        nombre:
                            practicaEncuesta.practica?.Periodo?.nombre ||
                            "Sin período"

                    })
                ),

            aplicaciones,

            respuestas

        };

    });

};