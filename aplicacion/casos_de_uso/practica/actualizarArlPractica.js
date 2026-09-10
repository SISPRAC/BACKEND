import { sequelize } from "../../../infraestructura/database/dbConnection.js";
import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

export const actualizarArlPractica = async (
    {
        practicaRepository,
        archivoRepository
    },
    practicaId,
    archivo
) => {

    if (!archivo) {
        throw new Error("Debe seleccionar un archivo");
    }

    const practica = await practicaRepository.findById(practicaId);

    if (!practica) {
        throw new Error("La práctica no existe");
    }

    const transaction = await sequelize.transaction();

    let archivoNuevo = null;

    try {

        /*
         * 1. Guardamos referencia de la ARL anterior
         */
        const archivoAnterior = practica.archivoArl;

        /*
         * 2. Subimos la nueva ARL a Supabase
         */
        const archivoSubido = await uploadArchivo(
            archivo.buffer,
            `ARL/${practicaId}`,
            archivo.originalname,
            archivo.mimetype
        );

        /*
         * 3. Creamos el registro en Archivos
         */
        archivoNuevo = await archivoRepository.create(
            {
                nombre: archivo.originalname,
                url: archivoSubido.url,
                public_id: archivoSubido.public_id,
                resource_type: archivoSubido.resource_type
            },
            transaction
        );

        /*
         * 4. Asociamos el nuevo archivo con la práctica
         */
        await practicaRepository.update(
            practicaId,
            {
                archivo_arl_id: archivoNuevo.id
            },
            transaction
        );

        /*
         * 5. Confirmamos los cambios en la base de datos
         */
        await transaction.commit();

        /*
         * 6. Si había una ARL anterior,
         *    la eliminamos de Supabase y de la BD.
         */
        if (archivoAnterior) {

            await deleteArchivo(
                archivoAnterior.public_id
            );

            await archivoRepository.delete(
                archivoAnterior.id
            );
        }

        /*
         * 7. Devolvemos la práctica actualizada
         */
        return await practicaRepository.findById(practicaId);

    } catch (error) {

        await transaction.rollback();

        /*
         * Si se alcanzó a subir el archivo a Supabase
         * pero algo falló después, lo eliminamos.
         */
        if (archivoNuevo?.public_id) {

            try {
                await deleteArchivo(
                    archivoNuevo.public_id
                );
            } catch (deleteError) {
                console.error(
                    "Error eliminando archivo de Supabase:",
                    deleteError.message
                );
            }
        }

        throw error;
    }
};