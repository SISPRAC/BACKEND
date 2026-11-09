import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { eliminarArchivoSiNoTieneReferencias } from "../archivo/eliminarArchivoSiNoTieneReferencias.js";

export const reemplazarDocumentoConvenioEmpresa = async (
    empresaRequisitoDocumentoRepository,
    archivoRepository,
    data,
    file
) => {

    const empresa_id = Number(data.empresa_id);
    const tipo_id = Number(data.tipo_requisito_documento_id);

    if (!empresa_id || !tipo_id) {
        throw new BadRequestError("Faltan datos para reemplazar el documento.");
    }

    if (!file) {
        throw new BadRequestError("Debes adjuntar un archivo PDF.");
    }

    if (file.mimetype !== "application/pdf") {
        throw new BadRequestError("El documento debe estar en formato PDF.");
    }

    const transaction = await sequelize.transaction();

    let newPublicId = null;
    let archivoAnteriorId = null;
    let nuevoArchivoId = null;

    try {

        const existente =
            await empresaRequisitoDocumentoRepository.findOne(
                empresa_id,
                tipo_id,
                transaction
            );

        if (!existente) {
            throw new NotFoundError(
                "Aún no has subido este documento, no hay nada que reemplazar."
            );
        }

        if (existente.estado === "APROBADO") {
            throw new BadRequestError(
                "Este documento ya fue aprobado y no puede modificarse."
            );
        }

        archivoAnteriorId = existente.archivo_id;

        const extension = path.extname(file.originalname);

        const nombreArchivo =
            `EMPRESA_REQ_${empresa_id}_${tipo_id}_${Date.now()}${extension}`;

        const resultado = await uploadArchivo(
            file.buffer,
            "SISPRAC/RequisitosEmpresa",
            nombreArchivo,
            file.mimetype
        );

        newPublicId = resultado.public_id;

        const nuevoArchivo = await archivoRepository.create(
            {
                nombre: file.originalname,
                url: resultado.url,
                public_id: resultado.public_id,
                resource_type: resultado.resource_type
            },
            transaction
        );

        nuevoArchivoId = nuevoArchivo.id;

        const registro =
            await empresaRequisitoDocumentoRepository.update(
                existente.id,
                {
                    archivo_id: nuevoArchivo.id,
                    estado: "PENDIENTE",
                    observacion: null,
                    fecha_subida: new Date()
                },
                transaction
            );

        await transaction.commit();

        // El cambio ya está confirmado: limpiamos el archivo anterior
        if (archivoAnteriorId && archivoAnteriorId !== nuevoArchivoId) {

            try {

                await eliminarArchivoSiNoTieneReferencias(
                    archivoRepository,
                    archivoAnteriorId
                );

            } catch (e) {

                console.error(
                    "No se pudo limpiar el archivo anterior:",
                    e.message
                );

            }

        }

        return registro;

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (newPublicId) {
            try {
                await deleteArchivo(newPublicId);
            } catch (e) {
                console.error(
                    "No se pudo eliminar el nuevo archivo de Supabase:",
                    e.message
                );
            }
        }

        if (
            error instanceof BadRequestError ||
            error instanceof NotFoundError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message || "No se pudo reemplazar el documento."
        );

    }

};