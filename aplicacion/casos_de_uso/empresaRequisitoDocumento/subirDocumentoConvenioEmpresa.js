
import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo,
    rutas
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import { notificarDocumentoConvenioEmpresa } from "../notificarEmail/notificarDocumentoConvenioEmpresa.js";

export const subirDocumentoConvenioEmpresa = async (
    empresaRequisitoDocumentoRepository,
    archivoRepository,
    data,
    file,
    {
        userRepository,
        notificacionRepository,
        empresaRepository,
        tipoRequisitoDocumentoRepository
    } = {}
) => {

    const empresa_id = Number(data.empresa_id);
    const tipo_id = Number(data.tipo_requisito_documento_id);

    if (!empresa_id || !tipo_id) {
        throw new BadRequestError("Faltan datos para subir el documento.");
    }

    if (!file) {
        throw new BadRequestError("Debes adjuntar un archivo PDF.");
    }

    if (file.mimetype !== "application/pdf") {
        throw new BadRequestError("El documento debe estar en formato PDF.");
    }

    if (file.mimetype !== "application/pdf") {
        throw new BadRequestError("El documento debe estar en formato PDF.");
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestError(
            "El archivo es demasiado pesado. El tamaño máximo permitido es de 2 MB."
        );
    }

    const transaction = await sequelize.transaction();

    let newPublicId = null;
    let registro;

    try {

        const existente =
            await empresaRequisitoDocumentoRepository.findOne(
                empresa_id,
                tipo_id,
                transaction
            );

        if (
            existente &&
            ["PENDIENTE", "APROBADO"].includes(existente.estado)
        ) {
            throw new BadRequestError(
                existente.estado === "APROBADO"
                    ? "Este documento ya fue aprobado y no necesita actualizarse."
                    : "Ya existe un documento pendiente de revisión para este requisito."
            );
        }

        const extension = path.extname(file.originalname);

        const nombreArchivo =
            `EMPRESA_REQ_${empresa_id}_${tipo_id}_${Date.now()}${extension}`;

        const resultado = await uploadArchivo(
            file.buffer,
            rutas.empresa(empresa_id, "requisitos"),
            nombreArchivo,
            file.mimetype
        );

        newPublicId = resultado.public_id;

        const archivo = await archivoRepository.create(
            {
                nombre: file.originalname,
                url: resultado.url,
                public_id: resultado.public_id,
                resource_type: resultado.resource_type
            },
            transaction
        );

        registro =
            await empresaRequisitoDocumentoRepository.create(
                {
                    empresa_id,
                    tipo_requisito_documento_id: tipo_id,
                    archivo_id: archivo.id,
                    estado: "PENDIENTE",
                    observacion: null,
                    fecha_subida: new Date()
                },
                transaction
            );

        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (newPublicId) {
            try {
                await deleteArchivo(newPublicId);
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
            error.message || "No se pudo subir el documento."
        );

    }

    // Notificar al director (fuera de la transacción).
    if (userRepository && notificacionRepository) {

        try {

            const empresa = empresaRepository
                ? await empresaRepository.findById(empresa_id)
                : null;

            const tipoRequisito = tipoRequisitoDocumentoRepository
                ? await tipoRequisitoDocumentoRepository.findById(tipo_id)
                : null;

            await notificarDocumentoConvenioEmpresa({
                empresa,
                nombreDocumento:
                    tipoRequisito?.nombre ?? "Documento de convenio",
                nombreArchivo: file.originalname,
                fechaSubida: registro?.fecha_subida,
                userRepository,
                notificacionRepository
            });

        } catch (error) {

            console.error(
                "Error notificando el documento de la empresa:",
                error
            );

        }

    }

    return registro;

};
