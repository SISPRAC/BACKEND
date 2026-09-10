import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const crearEntregaInforme = async (
    entregaInformeRepository,
    practicaInformeRepository,
    archivoRepository,
    data,
    file
) => {

    const transaction =
        await sequelize.transaction();

    let publicId = null;

    try {

        if (!file) {

            throw new BadRequestError(
                "Debe adjuntar el archivo del informe."
            );

        }

        /*
         * Verificamos que el informe esté configurado
         * para la práctica.
         */
        const practicaInforme =
            await practicaInformeRepository.findById(
                data.practica_informe_id
            );

        if (!practicaInforme) {

            throw new NotFoundError(
                "El informe de la práctica no existe."
            );

        }

        /*
         * El informe debe estar activo para
         * permitir nuevas entregas.
         */
        if (!practicaInforme.estado) {

            throw new BadRequestError(
                "El informe no está disponible para recibir entregas."
            );

        }

        /*
         * Buscamos la última versión.
         */
        const ultimaEntrega =
            await entregaInformeRepository.findLatestVersion(
                data.practica_practicante_id,
                data.practica_informe_id,
                transaction
            );

        let version = 1;

        if (ultimaEntrega) {

            version =
                ultimaEntrega.version + 1;

        }

        /*
         * Subimos el archivo nuevo.
         */
        const extension =
            path.extname(file.originalname);

        const nombreArchivo =
            `INFORME_${data.practica_informe_id}_${data.practica_practicante_id}_V${version}_${Date.now()}${extension}`;

        const resultado =
            await uploadArchivo(
                file.buffer,
                "SISPRAC/Informes/Entregas",
                nombreArchivo,
                file.mimetype
            );

        publicId =
            resultado.public_id;

        /*
         * Creamos el registro del archivo.
         */
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

        /*
         * Creamos la nueva versión.
         */
        const entrega =
            await entregaInformeRepository.create(
                {
                    practica_informe_id:
                        data.practica_informe_id,

                    practica_practicante_id:
                        data.practica_practicante_id,

                    archivo_id:
                        archivo.id,

                    version,

                    estado_tutor_docente:
                        "PENDIENTE",

                    estado_tutor_empresarial:
                        "PENDIENTE"

                },
                transaction
            );

        await transaction.commit();

        return entrega;

    } catch (error) {

        await transaction.rollback();

        /*
         * Si el archivo alcanzó a subirse pero algo
         * falló después, eliminamos únicamente
         * ese archivo nuevo.
         */
        if (publicId) {

            try {

                await deleteArchivo(
                    publicId
                );

            } catch (e) {

                console.error(
                    "No se pudo eliminar el archivo nuevo de Supabase:",
                    e.message
                );

            }

        }

        if (
            error instanceof NotFoundError ||
            error instanceof BadRequestError ||
            error instanceof ConflictError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message ||
            "No se pudo crear la entrega del informe."
        );

    }

};