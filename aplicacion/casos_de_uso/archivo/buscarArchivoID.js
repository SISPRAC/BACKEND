import { archivoRepository } from "../../../infraestructura/repositorios/archivoRepositoryImpl.js";

export const obtenerArchivo = async (id) => {
    return await archivoRepository.findById(id);
};