import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const crearPerfil = async (
    perfilRepository,
    data
) => {
 const {nombre, descripcion} = data;

 //validar nombre del perfil
 if (!nombre || !descripcion) {
    throw new BadRequestError("El nombre y la descripción son obligatorios");
 }
 
 const exist = await perfilRepository.findByName(nombre);

 if(exist){
    throw new ConflictError("Ya existe un perfil con ese nombre");
 }


 //crear perfil
 const newPerfil = await perfilRepository.create({
    nombre: nombre,
    descripcion: descripcion
 });


return {newPerfil}
};