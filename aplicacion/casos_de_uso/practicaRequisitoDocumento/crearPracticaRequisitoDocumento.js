import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

export const crearPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    archivoRepository,
    data,
    file
) => {

    const transaction = await sequelize.transaction();

    let publicId = null;

    try {

        if (file) {

            const extension =
                path.extname(file.originalname);

            const nombreArchivo =
                `REQ_DOC_${Date.now()}${extension}`;

            const resultado =
                await uploadArchivo(

                    file.buffer,
                    "SISPRAC/RequisitosDocumentales",
                    nombreArchivo,
                    file.mimetype

                );

            publicId = resultado.public_id;

            const archivo =
                await archivoRepository.create(

                    {

                        nombre: file.originalname,
                        url: resultado.url,
                        public_id: resultado.public_id,
                        resource_type: resultado.resource_type

                    },

                    transaction

                );

            data.archivo_id = archivo.id;

        }

        const requisito =
            await practicaRequisitoDocumentoRepository.create(
                data,
                transaction
            );

        await transaction.commit();

        return requisito;

    } catch (error) {

        await transaction.rollback();

        if (publicId) {

            try {

                await deleteArchivo(publicId);

            } catch (e) {

                console.error(
                    "No se pudo eliminar el archivo de Supabase:",
                    e.message
                );

            }

        }

        throw error;

    }

};