import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const actualizarArchivo = async (
    archivoRepository,
    data,
    file
) => {

    const {
        archivo_id,
        carpeta,
        nombre,
        resourceType = "auto"
    } = data;

    // Buscar archivo actual
    const archivoExistente =
        await archivoRepository.findById(archivo_id);

    if (!archivoExistente) {
        throw new NotFoundError(
            "El archivo no existe"
        );
    }

    if (!file) {
        throw new Error(
            "El nuevo archivo es requerido"
        );
    }

    // 1. Subir primero el archivo nuevo
    const nuevoArchivo = await uploadArchivo(
        file.buffer,
        carpeta,
        nombre,
        resourceType
    );

    try {

        // 2. Actualizar la BD
        const archivoActualizado =
            await archivoRepository.update(
                archivo_id,
                {
                    nombre: file.originalname,
                    url: nuevoArchivo.url,
                    public_id: nuevoArchivo.public_id,
                    resource_type: nuevoArchivo.resource_type,
                }
            );

        // 3. Eliminar archivo anterior de Cloudinary
        await deleteArchivo(
            archivoExistente.public_id,
            archivoExistente.resource_type
        );

        return archivoActualizado;

    } catch (error) {

        // Si falló la actualización de BD,
        // eliminar el archivo nuevo que acabamos de subir
        await deleteArchivo(
            nuevoArchivo.public_id,
            nuevoArchivo.resource_type
        );

        throw error;
    }
};