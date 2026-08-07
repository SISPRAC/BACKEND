import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const editarGrupo = async (
    grupoRepository,
    candidatoRepository,
    id,
    data
) => {

    const {
        nombre,
        periodo_id,
        tutorDocente_id,
        candidatos
    } = data;

    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError("Grupo no encontrado");
    }

    const exist = await grupoRepository.findByName(nombre);

    if (exist && exist.id !== Number(id)) {
        throw new ConflictError(
            "Ya existe un grupo con ese nombre"
        );
    }

    await grupoRepository.update(id, {
        nombre,
        periodo_id,
        tutorDocente_id
    });

    await candidatoRepository.removerGrupo(id);

    if (candidatos?.length > 0) {
        await candidatoRepository.asignarGrupo(
            candidatos,
            id
        );
    }

    return await grupoRepository.findById(id);
};