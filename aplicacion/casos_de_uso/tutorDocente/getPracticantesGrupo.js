import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getPracticantesGrupo = async (
    tutorDocenteRepository,
    grupoId,
    practicaId
) => {

    const grupo = await tutorDocenteRepository.findCandidatosByGrupoId(
        grupoId,
        practicaId
    );

    if (!grupo) {
        throw new BadRequestError(
            "Grupo no encontrado"
        );
    }

    return {
        id: grupo.id,
        nombre: grupo.nombre,

        practica_id: grupo.practica_id,

        practica: grupo.practica
            ? {
                id: grupo.practica.id,
                estado: grupo.practica.estado,
                periodo: grupo.practica.Periodo?.nombre || null
            }
            : null,

        tutorDocente_id: grupo.tutorDocente_id,

        practicantes:
            grupo.candidatosAsignados?.map(
                grupoCandidato => {

                    const candidato =
                        grupoCandidato.candidato;

                    const usuario =
                        candidato?.Usuario;

                    const practicante =
                        candidato?.practicante;

                    const postulacion =
                        candidato?.Postulacions?.find(
                            postulacion =>
                                postulacion.estado === "ACEPTADO"
                        );

                    const apertura =
                        postulacion?.AperturaVacante;

                    const vacante =
                        apertura?.Vacante;

                    const convenio =
                        vacante?.Convenio;

                    const empresa =
                        convenio?.Empresa;

                    return {
                        id: practicante?.id || null,

                        candidato_id:
                            candidato?.id || null,

                        codigo:
                            candidato?.codigo || null,

                        nombre:
                            `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim(),

                        empresa:
                            empresa?.nombre || null,

                        estado:
                            practicante ? "MATRICULADO" : "NO_MATRICULADO"
                    };
                }
            ) || []
    };
};