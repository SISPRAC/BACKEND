
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import {
    uploadArchivo,
    deleteArchivo,
} from "../../../infraestructura/external/storageService.js";

export const editarPracticaRequisitoDocumento = async (
    sequelize,
    practicaRequisitoDocumentoSubidoRepository,
    archivoRepository,
    data
) => {
    const {
        usuario_id,
        practica_requisito_documento_id,
        fecha_vencimiento,
        buffer,
        nombreArchivo,
        mimeType,
        carpeta,
    } = data;

    if (!usuario_id) {
        throw new BadRequestError("El usuario es obligatorio");
    }

    if (
        !practica_requisito_documento_id ||
        !Number.isInteger(Number(practica_requisito_documento_id)) ||
        Number(practica_requisito_documento_id) <= 0
    ) {
        throw new BadRequestError(
            "El identificador del requisito no es válido"
        );
    }

    if (!buffer || !nombreArchivo || !mimeType) {
        throw new BadRequestError("Debes adjuntar un archivo");
    }

    if (!carpeta) {
        throw new BadRequestError(
            "La carpeta de almacenamiento es obligatoria"
        );
    }

    let fechaVencimientoValidada = null;

    if (fecha_vencimiento) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_vencimiento)) {
            throw new BadRequestError(
                "La fecha de vencimiento debe tener el formato YYYY-MM-DD"
            );
        }

        const fecha = new Date(
            `${fecha_vencimiento}T00:00:00.000Z`
        );

        if (
            Number.isNaN(fecha.getTime()) ||
            fecha.toISOString().slice(0, 10) !== fecha_vencimiento
        ) {
            throw new BadRequestError(
                "La fecha de vencimiento no es válida"
            );
        }

        const hoy = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());

        if (fecha_vencimiento < hoy) {
            throw new BadRequestError(
                "La fecha de vencimiento no puede ser anterior a hoy"
            );
        }

        fechaVencimientoValidada = fecha_vencimiento;
    }

    const transaction = await sequelize.transaction();

    let archivoSubido = null;
    let transaccionConfirmada = false;

    try {
        // Buscar la entrega más reciente de este usuario y requisito.
        const documentos =
            await practicaRequisitoDocumentoSubidoRepository
                .findByUsuarioYRequisito(
                    usuario_id,
                    Number(practica_requisito_documento_id),
                    transaction
                );

        const documentoExistente = documentos[0];

        if (!documentoExistente) {
            throw new BadRequestError(
                "No existe un documento anterior para editar"
            );
        }

        // Un documento aprobado no se puede modificar.
        if (documentoExistente.estado === "APROBADO") {
            throw new BadRequestError(
                "No puedes editar un documento que ya fue aprobado"
            );
        }

        const archivoAnterior = documentoExistente.archivo;

        // Subir el archivo nuevo a Supabase.
        archivoSubido = await uploadArchivo(
            buffer,
            carpeta,
            nombreArchivo,
            mimeType
        );

        // Registrar el nuevo archivo en la base de datos.
        const nuevoArchivo = await archivoRepository.create(
            {
                nombre: nombreArchivo,
                url: archivoSubido.url,
                public_id: archivoSubido.public_id,
                resource_type: archivoSubido.resource_type,
            },
            transaction
        );

        // Actualizar la entrega existente, sin crear otra.
        await practicaRequisitoDocumentoSubidoRepository.update(
            documentoExistente.id,
            {
                archivo_id: nuevoArchivo.id,
                estado: "PENDIENTE",
                observacion: null,
                fecha_revision: null,
                usuario_revision_id: null,
                fecha_subida: new Date(),
                fecha_vencimiento: fechaVencimientoValidada,
            },
            transaction
        );

        await transaction.commit();
        transaccionConfirmada = true;

        // La base de datos ya apunta al archivo nuevo.
        // Limpiar el archivo anterior si no tiene otras referencias.
        if (archivoAnterior) {
            try {
                const tieneReferencias =
                    await archivoRepository.tieneReferencias(
                        archivoAnterior.id
                    );

                if (!tieneReferencias) {
                    if (archivoAnterior.public_id) {
                        await deleteArchivo(
                            archivoAnterior.public_id
                        );
                    }

                    await archivoRepository.delete(
                        archivoAnterior.id
                    );
                }
            } catch (errorStorage) {
                // La edición ya se confirmó; no se debe revertir.
                // Se registra el error para poder limpiar el archivo anterior.
                console.error(
                    "No se pudo eliminar el archivo anterior:",
                    errorStorage
                );
            }
        }

        return await practicaRequisitoDocumentoSubidoRepository.findById(
            documentoExistente.id
        );
    } catch (error) {
        if (!transaccionConfirmada) {
            await transaction.rollback();

            // Si la operación falló antes del commit,
            // eliminar el archivo nuevo de Supabase.
            if (archivoSubido?.public_id) {
                try {
                    await deleteArchivo(archivoSubido.public_id);
                } catch (errorStorage) {
                    console.error(
                        "No se pudo eliminar el archivo nuevo tras el error:",
                        errorStorage
                    );
                }
            }
        }

        throw error;
    }
};
