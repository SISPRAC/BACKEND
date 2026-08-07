import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const createRol = async (rolRepository, data) => {
    if (!data.nombre) {
       throw new BadRequestError("Nombre es requqerido");
    }

    const existingRol = await rolRepository.findByName(data.nombre);
    if (existingRol) {
        throw new BadRequestError("Ya hay un rol con ese nombre");
    }
    const newRol = await rolRepository.create(data);

    return newRol;
};