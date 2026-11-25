// aplicacion/casos_de_uso/periodoRespaldo/liberarEspacioLocalPeriodo.js
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

// Debe ser IDÉNTICO a como respaldarPeriodo.js arma los nombres en Drive
const nombreSeguro = (s) => String(s).replace(/[\\/]/g, "_");

const MB = 1024 * 1024;

/**
 * Borra del disco local los archivos de un período que YA están verificados en Drive.
 *
 * Por cada archivo, antes de borrar:
 *   1. Existe en disco (si no, no hay nada que liberar).
 *   2. Existe en Drive en TODAS las carpetas donde se respaldó.
 *   3. El tamaño y el md5 de Drive coinciden con los del archivo local.
 * Si algo no cuadra, el archivo NO se toca.
 *
 * Orden seguro: primero se marca `archivado` + `drive_file_id` en la BD y después
 * se borra el archivo. Si el proceso se cae en medio, el archivo sigue en disco
 * y se sirve normal (el middleware prefiere siempre la copia local).
 *
 * `dryRun: true` solo cuenta y devuelve qué borraría; no modifica nada.
 * `limite` = máximo de archivos a borrar en esta llamada (lote).
 */
export const liberarEspacioLocalPeriodo = async ({
    periodoId,
    periodoRepository,
    periodoRespaldoRepository,
    archivoRepository,
    driveService,   // { listarArchivosRecursivo }
    storage,        // { rutaDesdeUrl, infoArchivoLocal, deleteArchivo }
    dryRun = true,
    limite = 200,
}) => {
    const periodo = await periodoRepository.findById(periodoId);
    if (!periodo) throw new NotFoundError("Período no encontrado");

    const respaldo = await periodoRespaldoRepository.findByPeriodoId(periodoId);
    if (!respaldo || respaldo.estado_subida !== "SUBIDO" || !respaldo.drive_folder_id) {
        throw new ConflictError("El período aún no está respaldado en Drive");
    }
    if (respaldo.local_liberado) {
        return { periodoId, omitido: true, motivo: "Ya está liberado" };
    }

    try {
        const archivos = await periodoRespaldoRepository.obtenerArchivosDelPeriodo(periodoId);

        // Un mismo archivo puede estar en varias carpetas de Drive: se agrupan sus copias
        const porArchivo = new Map(); // archivo.id -> { archivo, rutasDrive:Set }
        for (const a of archivos) {
            const rutaDrive = `${nombreSeguro(a.carpeta)}/${a.categoria}/${nombreSeguro(
                `${a.contexto}__${a.id}__${a.nombre}`
            )}`;
            if (!porArchivo.has(a.id)) porArchivo.set(a.id, { archivo: a, rutasDrive: new Set() });
            porArchivo.get(a.id).rutasDrive.add(rutaDrive);
        }

        // Estado actual de Drive: una sola lectura de toda la carpeta del período
        const enDrive = new Map();
        for (const f of await driveService.listarArchivosRecursivo(respaldo.drive_folder_id)) {
            enDrive.set(f.ruta, f);
        }

        let liberados = 0;
        let bytes = 0;
        let noVerificados = 0;
        let restantes = 0;
        const detalle = [];
        const problemas = [];

        for (const { archivo, rutasDrive } of porArchivo.values()) {
            // Ya archivado en una corrida anterior
            const registro = await archivoRepository.findById(archivo.id);
            if (!registro || registro.archivado) continue;

            const publicId = storage.rutaDesdeUrl(registro.url);
            if (!publicId) continue; // URL vieja (Supabase) o externa: no es de este disco

            if (liberados >= limite) {
                restantes++;
                continue;
            }

            const local = await storage.infoArchivoLocal(publicId);
            if (!local) continue; // ya no está en disco: nada que liberar

            // Verificación contra Drive (todas las copias)
            let driveFileId = null;
            let ok = true;
            for (const ruta of rutasDrive) {
                const remoto = enDrive.get(ruta);
                if (!remoto || remoto.size !== local.size || !remoto.md5 || remoto.md5 !== local.md5) {
                    ok = false;
                    problemas.push(`Archivo ${archivo.id}: no coincide/no está en Drive (${ruta})`);
                    break;
                }
                driveFileId ??= remoto.id;
            }
            if (!ok) {
                noVerificados++;
                continue;
            }

            detalle.push({ id: archivo.id, publicId, mb: Number((local.size / MB).toFixed(2)) });

            if (!dryRun) {
                await archivoRepository.marcarArchivado(archivo.id, driveFileId);
                await storage.deleteArchivo(publicId);
            }
            liberados++;
            bytes += local.size;
        }

        const mb = Number((bytes / MB).toFixed(2));
        const completo = restantes === 0 && noVerificados === 0;

        if (!dryRun) {
            await periodoRespaldoRepository.registrarLiberacion(periodoId, {
                archivos: liberados,
                mb,
                completo,
                error: noVerificados
                    ? `${noVerificados} archivos sin verificar en Drive. ${problemas.slice(0, 5).join(" | ")}`
                    : null,
            });
        }

        return { periodoId, periodo: periodo.nombre, dryRun, liberados, mb, noVerificados, restantes, completo, detalle };
    } catch (error) {
        if (!dryRun) {
            await periodoRespaldoRepository.registrarLiberacion(periodoId, {
                archivos: 0, mb: 0, completo: false, error: error?.message ?? error,
            });
        }
        throw error;
    }
};
