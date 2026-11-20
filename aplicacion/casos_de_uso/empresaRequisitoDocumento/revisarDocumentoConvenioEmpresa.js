
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { notificarRevisionDocumentoConvenioEmpresa } from "../notificarEmail/notificarRevisionDocumentoConvenioEmpresa.js";

export const revisarDocumentoConvenioEmpresa = async (
    empresaRequisitoDocumentoRepository,
    id,
    data,
    {
        notificacionRepository,
        empresaRepository,
        tipoRequisitoDocumentoRepository
    } = {}
) => {

    const estado = data.estado;
    const observacion = data.observacion?.trim() || null;

    if (!["APROBADO", "RECHAZADO"].includes(estado)) {
        throw new BadRequestError("El estado debe ser APROBADO o RECHAZADO.");
    }

    if (estado === "RECHAZADO" && !observacion) {
        throw new BadRequestError(
            "Debes indicar el motivo del rechazo."
        );
    }

    const transaction = await sequelize.transaction();

    let actualizado;
    let empresaId;
    let tipoId;

    try {

        const doc =
            await empresaRequisitoDocumentoRepository.findById(
                Number(id),
                transaction
            );

        if (!doc) {
            throw new NotFoundError("El documento no existe.");
        }

        if (doc.estado !== "PENDIENTE") {
            throw new BadRequestError(
                "Solo se pueden revisar documentos pendientes."
            );
        }

        // Guardamos los datos ANTES de actualizar/commit.
        empresaId = doc.empresa_id;
        tipoId = doc.tipo_requisito_documento_id;

        actualizado =
            await empresaRequisitoDocumentoRepository.update(
                doc.id,
                { estado, observacion },
                transaction
            );

        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (
            error instanceof BadRequestError ||
            error instanceof NotFoundError
        ) {
            throw error;
        }

        throw new BadRequestError(
            error.message || "No se pudo registrar la revisión."
        );

    }

    // Notificar a la empresa (fuera de la transacción).
    console.log("[revisarDocumento] Datos para notificar:", {
        empresaId,
        tipoId,
        tieneNotificacionRepo: !!notificacionRepository,
        tieneEmpresaRepo: !!empresaRepository
    });

    if (!notificacionRepository || !empresaRepository) {

        console.warn(
            "[revisarDocumento] No se notificó: faltan repositorios."
        );

    } else {

        try {

            const empresa =
                await empresaRepository.findByIdConUsuario(empresaId);

            console.log("[revisarDocumento] Empresa encontrada:", {
                existe: !!empresa,
                usuarioId: empresa?.User?.id ?? null,
                correo: empresa?.User?.correo ?? null
            });

            const tipoRequisito = tipoRequisitoDocumentoRepository
                ? await tipoRequisitoDocumentoRepository.findById(tipoId)
                : null;

            await notificarRevisionDocumentoConvenioEmpresa({
                empresa,
                nombreDocumento:
                    tipoRequisito?.nombre ?? "Documento de convenio",
                estado,
                observacion,
                notificacionRepository
            });

        } catch (error) {

            console.error(
                "Error notificando la revisión del documento:",
                error
            );

        }

    }

    return actualizado;

};
