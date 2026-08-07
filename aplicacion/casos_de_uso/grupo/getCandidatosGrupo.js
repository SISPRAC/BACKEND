import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getCandidatosByGrupo = async (grupoRepository, id) => {

    const grupo = await grupoRepository.findCandidatosByGrupoId(id);

    if (!grupo) {
        throw new BadRequestError("Grupo no encontrado");
    }

    const candidatos = grupo.Candidatos?.map(candidato => {

        const ultimaPostulacion =
            candidato.Postulacions?.[0] || null;

        return {
            id: candidato.id,
            codigo: candidato.codigo,
            nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`,
            estado:
                ultimaPostulacion?.estado ??
                candidato.estado,
            empresa:
                ultimaPostulacion
                    ?.AperturaVacante
                    ?.Vacante
                    ?.Convenio
                    ?.Empresa
                    ?.nombre ?? null
        };
    }) || [];

    return {
    id: grupo.id,
    nombre: grupo.nombre,
    periodo: grupo.Periodo?.nombre,

    tutorDocente:
        `${grupo.TutorDocente?.Usuario?.nombres ?? ""} ${
            grupo.TutorDocente?.Usuario?.apellidos ?? ""
        }`.trim(),

    candidatos
};
};