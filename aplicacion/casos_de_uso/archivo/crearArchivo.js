import {
    uploadArchivo
} from "../../../infraestructura/external/storageService.js";

import { archivoRepository } from "../../../infraestructura/repositorios/archivoRepositoryImpl.js";

export const crearArchivo = async (
    data,
    file
) => {

    const {
        carpeta,
        nombre,
        resourceType = "auto"
    } = data;

    if (!file) {
        throw new Error("El archivo es requerido");
    }

    // Subir a Cloudinary
    const resultado = await uploadArchivo(
        file.buffer,
        carpeta,
        nombre,
        resourceType
    );

    // Guardar referencia en BD
    const archivo = await archivoRepository.create({
        nombre: file.originalname,
        url: resultado.url,
        public_id: resultado.public_id,
        resource_type: resultado.resource_type,
    });

    return archivo;
};