// aplicacion/casos_de_uso/periodoRespaldo/comprimirPeriodoAntiguo.js
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

/**
 * Comprime en un .zip la carpeta de Drive de un período ya respaldado y registra
 * el resultado (COMPRIMIDO / FALLO). El zip queda junto a la carpeta del período.
 *
 * Con `eliminarOriginal: true` la carpeta original se manda a la papelera de Drive
 * (recuperable 30 días) una vez guardado el zip; por defecto se conserva.
 */
export const comprimirPeriodoAntiguo = async ({
    periodoId,
    periodoRepository,
    periodoRespaldoRepository,
    driveService,            // { comprimirCarpeta, moverAPapelera }
    eliminarOriginal = false,
}) => {
    const periodo = await periodoRepository.findById(periodoId);
    if (!periodo) throw new NotFoundError("Período no encontrado");

    const respaldo = await periodoRespaldoRepository.findByPeriodoId(periodoId);
    if (!respaldo || respaldo.estado_subida !== "SUBIDO" || !respaldo.drive_folder_id) {
        throw new ConflictError("El período aún no está respaldado en Drive");
    }
    if (respaldo.estado_compresion === "COMPRIMIDO") {
        return { periodoId, omitido: true, motivo: "Ya está comprimido" };
    }

    try {
        const zip = await driveService.comprimirCarpeta({
            carpetaId: respaldo.drive_folder_id,
            nombreZip: `${periodo.nombre}.zip`,
        });

        await periodoRespaldoRepository.marcarComprimidoOk(periodoId, {
            zipId: zip.id,
            zipUrl: zip.webViewLink,
        });

        // Si esto falla el zip ya quedó registrado: no se marca como FALLO.
        let originalEliminado = false;
        if (eliminarOriginal) {
            try {
                await driveService.moverAPapelera(respaldo.drive_folder_id);
                originalEliminado = true;
            } catch (error) {
                console.error(`No se pudo enviar a la papelera la carpeta del período ${periodo.nombre}:`, error);
            }
        }

        return { periodoId, zipId: zip.id, originalEliminado };
    } catch (error) {
        await periodoRespaldoRepository.marcarCompresionFallo(periodoId, error);
        throw error;
    }
};
