
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";


export const subirPracticaRequisitoDocumento = async (
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
        carpeta
    } = data;


    // =========================================================
    // VALIDAR USUARIO
    // =========================================================

    if (!usuario_id) {
        throw new BadRequestError(
            "El usuario es obligatorio"
        );
    }


    // =========================================================
    // VALIDAR REQUISITO
    // =========================================================

    if (
        !practica_requisito_documento_id ||
        !Number.isInteger(Number(practica_requisito_documento_id)) ||
        Number(practica_requisito_documento_id) <= 0
    ) {
        throw new BadRequestError(
            "El identificador del requisito no es válido"
        );
    }


    // =========================================================
    // VALIDAR ARCHIVO ANTES DE SUBIRLO
    // =========================================================

    if (
        !buffer ||
        !nombreArchivo ||
        !mimeType
    ) {
        throw new BadRequestError(
            "Debes adjuntar un archivo"
        );
    }


    // =========================================================
    // VALIDAR FECHA DE VENCIMIENTO
    // =========================================================

    let fechaVencimientoValidada = null;

    if (fecha_vencimiento) {

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha_vencimiento)
        ) {
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

        const hoy = new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "America/Bogota",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).format(new Date());

        if (fecha_vencimiento < hoy) {
            throw new BadRequestError(
                "La fecha de vencimiento no puede ser anterior a hoy"
            );
        }

        fechaVencimientoValidada = fecha_vencimiento;
    }


    // =========================================================
    // VALIDAR CARPETA
    // =========================================================

    if (!carpeta) {
        throw new BadRequestError(
            "La carpeta de almacenamiento es obligatoria"
        );
    }


    // =========================================================
    // INICIAR TRANSACCIÓN
    // =========================================================

    const transaction = await sequelize.transaction();

    let archivoSubido = null;

    try {

        // =====================================================
        // SUBIR ARCHIVO A SUPABASE
        // =====================================================

        archivoSubido = await uploadArchivo(
            buffer,
            carpeta,
            nombreArchivo,
            mimeType
        );


        // =====================================================
        // REGISTRAR ARCHIVO EN LA BASE DE DATOS
        // =====================================================

        const nuevoArchivo = await archivoRepository.create(
            {
                nombre: nombreArchivo,
                url: archivoSubido.url,
                public_id: archivoSubido.public_id,
                resource_type: archivoSubido.resource_type
            },
            transaction
        );


        // =====================================================
        // REGISTRAR DOCUMENTO DEL REQUISITO
        // =====================================================

        const documento =
            await practicaRequisitoDocumentoSubidoRepository.create(
                {
                    usuario_id,
                    practica_requisito_documento_id:
                        Number(practica_requisito_documento_id),
                    archivo_id: nuevoArchivo.id,
                    estado: "PENDIENTE",
                    fecha_vencimiento: fechaVencimientoValidada
                },
                transaction
            );


        // =====================================================
        // CONFIRMAR TRANSACCIÓN
        // =====================================================

        await transaction.commit();

        return documento;

    } catch (error) {

        await transaction.rollback();


        // =====================================================
        // ELIMINAR ARCHIVO DE SUPABASE SI FALLÓ LA OPERACIÓN
        // =====================================================

        if (archivoSubido?.public_id) {

            try {

                await deleteArchivo(
                    archivoSubido.public_id
                );

            } catch (errorStorage) {

                console.error(
                    "No se pudo eliminar el archivo de Supabase tras el error:",
                    errorStorage
                );
            }
        }

        throw error;
    }
};
