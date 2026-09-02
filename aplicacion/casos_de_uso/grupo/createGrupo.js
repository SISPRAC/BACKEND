import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const crearGrupo = async (
    grupoRepository,
    grupoCandidatoRepository,
    data
) => {

    const {
        nombre,
        practica_id,
        tutorDocente_id,
        candidatos
    } = data;

    // Validar datos
    if (!nombre || !practica_id || !tutorDocente_id) {
        throw new BadRequestError(
            "Los datos son obligatorios"
        );
    }

    // El nombre solo debe ser único dentro de la práctica
    const exist =
        await grupoRepository.findByNameAndPractica(
            nombre,
            practica_id
        );

    if (exist) {
        throw new ConflictError(
            "Ya existe un grupo con ese nombre en esta práctica"
        );
    }

    // Crear grupo
    const newGrupo = await grupoRepository.create({
        nombre,
        practica_id,
        tutorDocente_id
    });

    // Asignar candidatos al grupo mediante GrupoCandidato
    if (candidatos?.length > 0) {

        for (const candidato_id of candidatos) {

            await grupoCandidatoRepository.create({
                grupo_id: newGrupo.id,
                candidato_id
            });

        }
    }

    return newGrupo;
};