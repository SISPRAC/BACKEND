import { archivoRepository } from "../../../infraestructura/repositorios/archivoRepositoryImpl.js";

export const listarArchivos = async () => {
    return await archivoRepository.findAll();
};