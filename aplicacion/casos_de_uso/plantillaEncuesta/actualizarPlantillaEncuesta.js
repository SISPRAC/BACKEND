import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const actualizarPlantillaEncuesta = async (
    plantillaEncuestaRepository,
    rolRepository,
    id,
    data
) => {

    // =========================
    // Buscar encuesta
    // =========================

    const encuesta =
        await plantillaEncuestaRepository.findById(id);


    if (!encuesta) {

        throw new NotFoundError(
            "La encuesta no existe"
        );

    }


    // =========================
    // Actualizar rol
    // =========================

    let rol_id = encuesta.rol_id;


    if (data.rol) {


        const rol =
            await rolRepository.findByNombre(data.rol);


        if (!rol) {

            throw new NotFoundError(
                "El rol no existe"
            );

        }


        rol_id = rol.id;

    }


    // =========================
    // Actualizar plantilla
    // =========================

    await plantillaEncuestaRepository.update(

        id,

        {
            titulo: data.titulo,
            descripcion: data.descripcion,
            rol_id
        }

    );


    // =========================
    // Retornar plantilla actualizada
    // =========================

    return await plantillaEncuestaRepository.findById(id);

};