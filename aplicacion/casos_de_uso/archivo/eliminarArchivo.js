import { archivoRepository } from "../../../infraestructura/repositorios/archivoRepositoryimpl.js";

export const eliminarArchivo = async (id) => {
    return await archivoRepository.delete(id);
};