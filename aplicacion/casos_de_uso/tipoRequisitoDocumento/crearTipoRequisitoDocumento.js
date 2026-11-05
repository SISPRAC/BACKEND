import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const crearTipoRequisitoDocumento = async (
    tipoRequisitoDocumentoRepository,
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
                `TIPO_REQ_DOC_${Date.now()}${extension}`;

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

        const tipo =
            await tipoRequisitoDocumentoRepository.create(
                data,
                transaction
            );

        await transaction.commit();

        return tipo;

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

        if (error instanceof BadRequestError) {
            throw error;
        }

        throw new BadRequestError(
            error.message || "No se pudo crear el tipo de requisito documental."
        );

    }

};