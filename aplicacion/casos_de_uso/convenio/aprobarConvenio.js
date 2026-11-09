import path from "path";

import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { obtenerRevisionRequisitosEmpresa } from "../empresaRequisitoDocumento/obtenerRevisionRequisitosEmpresa.js";

export const aprobarConvenio = async (
    convenioRepository,
    historialConvenioRepository,
    archivoRepository,
    empresaRequisitoDocumentoRepository,
    tipoRequisitoDocumentoRepository,
    id,
    data,
    file
) => {

    const comentario = data.comentario?.trim();
    const usuario_id = Number(data.usuario_id);

    if (!file) {
        throw new BadRequestError("Debes adjuntar el convenio firmado.");
    }

    if (file.mimetype !== "application/pdf") {
        throw new BadRequestError("El convenio firmado debe ser un PDF.");
    }


    if (!usuario_id) {
        throw new BadRequestError("Usuario no válido.");
    }

    const convenio = await convenioRepository.findById(id);

    if (!convenio) {
        throw new NotFoundError("Convenio no encontrado.");
    }

    if (["APROBADO", "VENCIDO"].includes(convenio.estado)) {
        throw new BadRequestError(
            "Este convenio ya fue finalizado y no puede modificarse."
        );
    }

    // Todos los requisitos obligatorios deben estar aprobados
    const revision = await obtenerRevisionRequisitosEmpresa(
        empresaRequisitoDocumentoRepository,
        tipoRequisitoDocumentoRepository,
        convenio.empresa_id
    );

    const obligatorios = revision.filter((r) => r.tipo.obligatorio);

    const completos =
        obligatorios.length > 0 &&
        obligatorios.every((r) => r.documento?.estado === "APROBADO");

    if (!completos) {
        throw new BadRequestError(
            "La empresa aún tiene requisitos obligatorios sin aprobar."
        );
    }

    const transaction = await sequelize.transaction();

    let newPublicId = null;

    try {

        const extension = path.extname(file.originalname);

        const nombreArchivo =
            `CONVENIO_FIRMADO_${convenio.empresa_id}_${Date.now()}${extension}`;

        const resultado = await uploadArchivo(
            file.buffer,
            "SISPRAC/Convenios",
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

        await convenioRepository.update(
            id,
            {
                estado: "APROBADO",
                archivo_id: archivo.id
            },
            transaction
        );

        await historialConvenioRepository.create(
            {
                convenio_id: id,
                archivo_id: archivo.id,
                accion: "APROBADO",
                fecha: new Date(),
                comentario,
                usuario_id
            },
            transaction
        );

        await transaction.commit();

        return await convenioRepository.findById(id);

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (newPublicId) {
            try {
                await deleteArchivo(newPublicId);
            } catch (e) {
                console.error(
                    "No se pudo eliminar el archivo firmado de Supabase:",
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
            error.message || "No se pudo aprobar el convenio."
        );

    }

};