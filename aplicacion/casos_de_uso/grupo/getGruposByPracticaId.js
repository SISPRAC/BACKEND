import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getGruposByPracticaId = async (
    grupoRepository,
    practica_id
) => {

    if (!practica_id) {
        throw new BadRequestError(
            "El ID de la práctica es obligatorio"
        );
    }

    const grupos = await grupoRepository.findByPracticaId(
        practica_id
    );

    return grupos.map(grupo => ({
        id: grupo.id,
        nombre: grupo.nombre
    }));
};