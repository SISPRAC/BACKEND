import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getGrupo = async (grupoRepository, id) => {

    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError("Grupo no encontrado");
    }

    return {
    id: grupo.id,
    nombre: grupo.nombre,

    periodo_id: grupo.periodo_id,
    periodo: grupo.Periodo?.nombre,

    tutorDocente_id: grupo.tutorDocente_id,
    tutorDocente: {
        id: grupo.TutorDocente?.id,
        nombreCompleto: `${grupo.TutorDocente?.Usuario?.nombres} ${grupo.TutorDocente?.Usuario?.apellidos}`
    },

    practicantes: grupo.Candidatos?.map(candidato => ({
        id: candidato.id,
        codigo: candidato.codigo,
        nombre: `${candidato.Usuario?.nombres} ${candidato.Usuario?.apellidos}`
    }))
};
};