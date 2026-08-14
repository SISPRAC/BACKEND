import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getGrupo = async (
    grupoRepository,
    id
) => {

    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError(
            "Grupo no encontrado"
        );
    }

    return {
        id: grupo.id,
        nombre: grupo.nombre,

        practica_id: grupo.practica_id,
        practica: grupo.Practica?.nombre,

        tutorDocente_id: grupo.tutorDocente_id,
        tutorDocente: {
            id: grupo.TutorDocente?.id,
            nombreCompleto:
                `${grupo.TutorDocente?.Usuario?.nombres ?? ""} ${
                    grupo.TutorDocente?.Usuario?.apellidos ?? ""
                }`.trim()
        },

        practicantes:
            grupo.candidatosAsignados?.map(
                grupoCandidato => {

                    const candidato =
                        grupoCandidato.candidato;

                    return {
                        id: candidato?.id,
                        codigo: candidato?.codigo,
                        nombre:
                            `${candidato?.Usuario?.nombres ?? ""} ${
                                candidato?.Usuario?.apellidos ?? ""
                            }`.trim()
                    };
                }
            ) || []
    };
};