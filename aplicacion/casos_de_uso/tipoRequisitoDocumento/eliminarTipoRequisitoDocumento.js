
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import { eliminarArchivoSiNoTieneReferencias } from "../archivo/eliminarArchivoSiNoTieneReferencias.js";

export const eliminarTipoRequisitoDocumento = async (
    tipoRequisitoDocumentoRepository,
    practicaRequisitoDocumentoRepository,
    empresaRequisitoDocumentoRepository,
    archivoRepository,
    id
) => {
    const transaction = await sequelize.transaction();

    try {
        const tipo =
            await tipoRequisitoDocumentoRepository.findById(id);

        if (!tipo) {
            throw new NotFoundError(
                "El tipo de requisito documental no existe."
            );
        }

        // Verificar referencias en requisitos de prácticas
        const tieneReferenciasPracticas =
            await practicaRequisitoDocumentoRepository
                .existsByTipoRequisitoDocumentoId(id, transaction);

        // Verificar referencias en requisitos de empresas
        const tieneReferenciasEmpresas =
            await empresaRequisitoDocumentoRepository
                .existsByTipoRequisitoDocumentoId(id, transaction);

        if (tieneReferenciasPracticas || tieneReferenciasEmpresas) {
            throw new ConflictError(
                "No se puede eliminar este tipo de requisito documental porque está siendo utilizado por prácticas o empresas."
            );
        }

        const archivoId = tipo.archivo_id;

        await tipoRequisitoDocumentoRepository.delete(
            id,
            transaction
        );

        await transaction.commit();

        // Limpiar archivo únicamente si ya no tiene referencias
        if (archivoId) {
            try {
                await eliminarArchivoSiNoTieneReferencias(
                    archivoRepository,
                    archivoId
                );
            } catch (e) {
                console.error(
                    "No se pudo limpiar el archivo asociado:",
                    e.message
                );
            }
        }

        return {
            message:
                "Tipo de requisito documental eliminado correctamente."
        };

    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
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
            "No se pudo eliminar el tipo de requisito documental."
        );
    }
};
