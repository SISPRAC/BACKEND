import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const editarGrupo = async (
    grupoRepository,
    grupoCandidatoRepository,
    data,
    id
) => {

    const {
        nombre,
        practica_id,
        tutorDocente_id,
        candidatos
    } = data;

    // Buscar grupo
    const grupo = await grupoRepository.findById(id);

    if (!grupo) {
        throw new BadRequestError(
            "El grupo no existe"
        );
    }

    // Un grupo que ya tenga practicantes no puede modificarse
    const tienePracticantes =
        await grupoRepository.tienePracticantes(id);

    if (tienePracticantes) {
        throw new ConflictError(
            "No se puede modificar el grupo porque tiene practicantes asignados"
        );
    }

    // Validar datos
    if (!nombre || !practica_id || !tutorDocente_id) {
        throw new BadRequestError(
            "Los datos son obligatorios"
        );
    }

    // Validar nombre único dentro de la práctica
    const grupoExistente =
        await grupoRepository.findByNameAndPractica(
            nombre,
            practica_id
        );

    if (
        grupoExistente &&
        grupoExistente.id !== Number(id)
    ) {
        throw new ConflictError(
            "Ya existe un grupo con ese nombre en esta práctica"
        );
    }

    // Actualizar grupo
    const grupoActualizado =
        await grupoRepository.update(id, {
            nombre,
            practica_id,
            tutorDocente_id
        });

    // Eliminar las relaciones actuales
    await grupoCandidatoRepository.deleteByGrupo(id);

    // Crear nuevamente las relaciones
    if (candidatos?.length > 0) {

        for (const candidato_id of candidatos) {

            await grupoCandidatoRepository.create({
                grupo_id: id,
                candidato_id
            });

        }
    }

    return grupoActualizado;
};