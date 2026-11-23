// aplicacion/casos_de_uso/periodoRespaldo/respaldarPeriodo.js
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

// Drive no admite "/" en los nombres que nos interesan; se limpia lo mínimo.
const nombreSeguro = (s) => String(s).replace(/[\\/]/g, "_");

/**
 * Copia a Google Drive todos los archivos de un período:
 *   <raíz>/<período>/<código>_<Apellidos>_<Nombres>/<Categoría>/<contexto>__<id>__<nombre original>
 * (lo que no es de un practicante, como la ARL, va en <período>/_General/...)
 *
 * Es reanudable: carpetas y archivos ya presentes en Drive se reutilizan/omiten,
 * así que un reintento tras un FALLO solo sube lo que faltó.
 * El resultado (SUBIDO / FALLO) queda registrado en PeriodoRespaldos.
 */
export const respaldarPeriodo = async ({
    periodoId,
    periodoRepository,
    periodoRespaldoRepository,
    driveService,            // { crearCarpeta, subirArchivo, listarHijos }
    descargarArchivoStream,  // (url) => Promise<{ stream, mimeType }>
}) => {
    const periodo = await periodoRepository.findById(periodoId);
    if (!periodo) throw new NotFoundError("Período no encontrado");

    const respaldo = await periodoRespaldoRepository.obtenerOCrear(periodoId);
    if (respaldo.estado_subida === "SUBIDO") {
        return { periodoId, omitido: true, motivo: "Ya está respaldado" };
    }

    try {
        const archivos = await periodoRespaldoRepository.obtenerArchivosDelPeriodo(periodoId);

        const carpetaPeriodo = await driveService.crearCarpeta({ nombre: periodo.nombre });

        // Carpeta del practicante -> subcarpeta de categoría, con los nombres que ya contiene
        const carpetas = new Map(); // carpeta -> id
        const categorias = new Map(); // "carpeta|categoria" -> { id, existentes:Set }
        const obtenerCategoria = async (carpetaNombre, categoria) => {
            if (!carpetas.has(carpetaNombre)) {
                const c = await driveService.crearCarpeta({
                    nombre: nombreSeguro(carpetaNombre),
                    padreId: carpetaPeriodo.id,
                });
                carpetas.set(carpetaNombre, c.id);
            }
            const clave = `${carpetaNombre}|${categoria}`;
            if (!categorias.has(clave)) {
                const cat = await driveService.crearCarpeta({
                    nombre: categoria,
                    padreId: carpetas.get(carpetaNombre),
                });
                const hijos = await driveService.listarHijos(cat.id);
                categorias.set(clave, {
                    id: cat.id,
                    existentes: new Set(hijos.map((h) => h.name)),
                });
            }
            return categorias.get(clave);
        };

        let subidos = 0;
        let omitidos = 0;
        const errores = [];

        for (const archivo of archivos) {
            try {
                const destino = await obtenerCategoria(archivo.carpeta, archivo.categoria);
                const nombre = nombreSeguro(
                    `${archivo.contexto}__${archivo.id}__${archivo.nombre}`
                );

                if (destino.existentes.has(nombre)) {
                    omitidos++;
                    continue;
                }

                const { stream, mimeType } = await descargarArchivoStream(archivo.url);
                await driveService.subirArchivo({
                    stream,
                    nombre,
                    carpetaId: destino.id,
                    mimeType,
                });
                destino.existentes.add(nombre);
                subidos++;
            } catch (error) {
                errores.push(`Archivo ${archivo.id}: ${error.message}`);
            }
        }

        // Un solo archivo fallido deja el período en FALLO (se reintentará en la
        // siguiente corrida y solo subirá lo que falte).
        if (errores.length) {
            throw new Error(
                `${errores.length} de ${archivos.length} archivos fallaron. ${errores.slice(0, 5).join(" | ")}`
            );
        }

        await periodoRespaldoRepository.marcarSubidoOk(periodoId, {
            folderId: carpetaPeriodo.id,
            folderUrl: carpetaPeriodo.webViewLink,
        });

        return { periodoId, total: archivos.length, subidos, omitidos };
    } catch (error) {
        await periodoRespaldoRepository.marcarSubidaFallo(periodoId, error);
        throw error;
    }
};
