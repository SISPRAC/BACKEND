import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const crearPlantillaEncuesta = async (
    plantillaEncuestaRepository,
    rolRepository,
    data
) => {

    const {
        titulo,
        descripcion,
        rol
    } = data;


    // =========================
    // Validar datos obligatorios
    // =========================

    if (!titulo || !rol) {

        throw new BadRequestError(
            "Titulo y rol son obligatorios"
        );

    }


    // =========================
    // Buscar rol
    // =========================

    const rolEncontrado =
        await rolRepository.findByNombre(rol);


    if (!rolEncontrado) {

        throw new NotFoundError(
            "El rol no existe"
        );

    }


    // =========================
    // Crear plantilla
    // =========================

    const nuevaEncuesta =
        await plantillaEncuestaRepository.create({

            titulo,

            descripcion,

            rol_id: rolEncontrado.id

        });


    // =========================
    // Retornar plantilla creada
    // =========================

    return await plantillaEncuestaRepository.findById(
        nuevaEncuesta.id
    );

};