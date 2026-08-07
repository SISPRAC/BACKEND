import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

export const actualizarPracticaRequisitoDocumento = async (
    practicaRequisitoDocumentoRepository,
    archivoRepository,
    id,
    data,
    file
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

    let nuevoPublicId = null;
    let publicIdAnterior = null;

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

            nuevoPublicId =
                resultado.public_id;

            if (requisito.archivo_id) {

                const archivoActual =
                    await archivoRepository.findById(
                        requisito.archivo_id
                    );

                publicIdAnterior =
                    archivoActual.public_id;

                await archivoRepository.update(

                    archivoActual.id,

                    {

                        nombre: file.originalname,
                        url: resultado.url,
                        public_id: resultado.public_id,
                        resource_type: resultado.resource_type

                    },

                    transaction

                );

            } else {

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

                data.archivo_id =
                    archivo.id;

            }

        }

        const requisitoActualizado =
            await practicaRequisitoDocumentoRepository.update(

                id,
                data,
                transaction

            );

        await transaction.commit();

        if (publicIdAnterior) {

            try {

                await deleteArchivo(
                    publicIdAnterior
                );

            } catch (error) {

                console.error(
                    "No se pudo eliminar el archivo anterior:",
                    error.message
                );

            }

        }

        return requisitoActualizado;

    } catch (error) {

        await transaction.rollback();

        if (nuevoPublicId) {

            try {

                await deleteArchivo(
                    nuevoPublicId
                );

            } catch (e) {

                console.error(
                    "No se pudo eliminar el archivo nuevo:",
                    e.message
                );

            }

        }

        throw error;

    }

};