import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

export const eliminarPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    archivoRepository,
    id
) => {

    const requisito =
        await practicaRequisitoDocumentoRepository.findById(id);

    if (!requisito) {

        throw new Error(
            "El requisito documental no existe."
        );

    }

    const transaction =
        await sequelize.transaction();

    let publicId = null;

    try {

        if (requisito.archivo_id) {

            const archivo =
                await archivoRepository.findById(
                    requisito.archivo_id
                );

            if (archivo) {

                publicId = archivo.public_id;

                await archivoRepository.delete(
                    archivo.id,
                    transaction
                );

            }

        }

        await practicaRequisitoDocumentoRepository.delete(
            id,
            transaction
        );

        await transaction.commit();

        if (publicId) {

            try {

                await deleteArchivo(
                    publicId
                );

            } catch (error) {

                console.error(
                    "No se pudo eliminar el archivo de Supabase:",
                    error.message
                );

            }

        }

    } catch (error) {

        await transaction.rollback();

        throw error;

    }

};