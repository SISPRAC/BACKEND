import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getPracticantesGrupo = async (
    tutorDocenteRepository,
    grupoId,
    practicaId
) => {

    const grupo =
        await tutorDocenteRepository.findGrupoById(
            grupoId,
            practicaId
        );

    if (!grupo) {

        throw new BadRequestError(
            "El grupo no existe o no pertenece a la práctica indicada"
        );
    }

    const practicantes = [];

    for (const grupoCandidato of grupo.candidatosAsignados) {

        const candidato = grupoCandidato.candidato;

        if (!candidato) {
            continue;
        }

        const postulacion =
            await tutorDocenteRepository
                .findPostulacionByCandidatoAndPractica(
                    candidato.id,
                    practicaId
                );

        let practicaPracticante = null;

        if (candidato.practicante) {

            practicaPracticante =
                await tutorDocenteRepository
                    .findPracticaPracticanteByPracticanteAndPractica(
                        candidato.practicante.id,
                        practicaId
                    );
        }


        /*
         * Empresa
         */
        const empresa =
            postulacion
                ?.AperturaVacante
                ?.Vacante
                ?.Convenio
                ?.Empresa;


        /*
         * Estado
         *
         * Si ya es practicante:
         * estado de PracticaPracticante.
         *
         * Si todavía no es practicante:
         * estado de Postulacion.
         *
         * Si nunca se postuló:
         * SIN_POSTULACION.
         */
        let estado = "SIN_POSTULACION";

        if (practicaPracticante) {

            estado = practicaPracticante.estado;

        } else if (postulacion) {

            estado = postulacion.estado;
        }


        practicantes.push({

            id_grupo_candidato: grupoCandidato.id,

            id_candidato: candidato.id,

            id_practicante:
                candidato.practicante?.id || null,

            codigo:
                candidato.codigo || null,

            nombre: [
                candidato.Usuario?.nombres,
                candidato.Usuario?.apellidos
            ]
                .filter(Boolean)
                .join(" ") || null,

            correo:
                candidato.Usuario?.correo || null,

            empresa:
                empresa?.nombre || "Sin empresa",

            estado
        });
    }


    return {
        id: grupo.id,
        nombre: grupo.nombre,
        practica_id: grupo.practica_id,

        practica: {
            estado: grupo.practica?.estado || null,
            fecha_inicio: grupo.practica?.fecha_inicio || null,
            fecha_fin: grupo.practica?.fecha_fin || null,

            periodo: {
                id: grupo.practica?.Periodo?.id || null,
                nombre: grupo.practica?.Periodo?.nombre || null
            }
        },

        practicantes
    };
};