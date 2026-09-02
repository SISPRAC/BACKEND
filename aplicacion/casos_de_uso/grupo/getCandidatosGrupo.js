import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getCandidatosGrupo = async (
    grupoRepository,
    id
) => {

    const grupo =
        await grupoRepository.findCandidatosByGrupoId(id);

    if (!grupo) {
        throw new BadRequestError(
            "Grupo no encontrado"
        );
    }

    const tutor = grupo.TutorDocente;
    const usuarioTutor = tutor?.Usuario;

    return {
        id: grupo.id,
        nombre: grupo.nombre,

        practica_id: grupo.practica_id,
        practica: grupo.practica,

        tutorDocente_id: grupo.tutorDocente_id,

        tutorDocente: tutor
            ? {
                id: tutor.id,
                codigo: tutor.codigo,
                nombre: `${usuarioTutor?.nombres || ""} ${usuarioTutor?.apellidos || ""}`.trim()
            }
            : null,

        candidatos:
            grupo.candidatosAsignados?.map(
                grupoCandidato => {

                    const candidato =
                        grupoCandidato.candidato;

                    const usuario =
                        candidato?.Usuario;

                    const postulacion =
                        candidato?.Postulacions?.[0];

                    const apertura =
                        postulacion?.AperturaVacante;

                    const vacante =
                        apertura?.Vacante;

                    const convenio =
                        vacante?.Convenio;

                    const empresa =
                        convenio?.Empresa;

                    return {
                        id: candidato?.id,
                        codigo: candidato?.codigo,

                        nombre:
                            `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim(),

                        empresa:
                            empresa?.nombre || null
                    };
                }
            ) || []
    };
};