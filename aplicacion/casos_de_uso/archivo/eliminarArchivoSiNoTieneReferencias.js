import {
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const eliminarArchivoSiNoTieneReferencias = async (
    archivoRepository,
    archivo_id
) => {

    if (!archivo_id) {
        return false;
    }

    const archivo =
        await archivoRepository.findById(
            archivo_id
        );

    if (!archivo) {

        throw new NotFoundError(
            "El archivo asociado no existe."
        );

    }

    const tieneReferencias =
        await archivoRepository.tieneReferencias(
            archivo_id
        );

    if (tieneReferencias) {
        return false;
    }

    if (archivo.public_id) {

        await deleteArchivo(
            archivo.public_id
        );

    }

    await archivoRepository.delete(
        archivo_id
    );

    return true;
};