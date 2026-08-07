import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const crearGrupo = async (
    grupoRepository,
    candidatoRepository,
    data
) => {
    const { nombre, periodo_id, tutorDocente_id, candidatos } = data;

    // validar datos
    if (!nombre || !periodo_id || !tutorDocente_id) {
        throw new BadRequestError("Los datos son obligatorios");
    }

    const exist = await grupoRepository.findByName(nombre);

    if (exist) {
        throw new ConflictError("Ya existe un grupo con ese nombre");
    }

    // crear grupo
    const newGrupo = await grupoRepository.create({
        nombre,
        periodo_id,
        tutorDocente_id
    });

    // asignar grupo a candidatos
    if (candidatos?.length > 0) {
        await candidatoRepository.asignarGrupo(
            candidatos,
            newGrupo.id
        );
    };

    return newGrupo;
};