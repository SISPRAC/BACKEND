
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const aprobarPracticaRequisitoDocumento = async (
    { practicaRequisitoDocumentoSubidoRepository },
    id,
    usuario_revision_id
) => {
    if (!id) {
        throw new BadRequestError("El documento es obligatorio.");
    }

    if (!usuario_revision_id) {
        throw new BadRequestError("El usuario revisor es obligatorio.");
    }

    const documentoId = Number(id);
    const usuarioRevisionId = Number(usuario_revision_id);

    if (!Number.isInteger(documentoId) || documentoId <= 0) {
        throw new BadRequestError("El documento no es válido.");
    }

    if (!Number.isInteger(usuarioRevisionId) || usuarioRevisionId <= 0) {
        throw new BadRequestError("El usuario revisor no es válido.");
    }

    const documento =
        await practicaRequisitoDocumentoSubidoRepository.findById(
            documentoId
        );

    if (!documento) {
        throw new NotFoundError("No se encontró el documento.");
    }

    if (documento.estado !== "PENDIENTE") {
        throw new ConflictError(
            "Solo se pueden aprobar documentos pendientes de revisión."
        );
    }

    await practicaRequisitoDocumentoSubidoRepository.update(
        documentoId,
        {
            estado: "APROBADO",
            fecha_revision: new Date(),
            usuario_revision_id: usuarioRevisionId,
            observacion: null,
        }
    );

    return await practicaRequisitoDocumentoSubidoRepository.findById(
        documentoId
    );
};
