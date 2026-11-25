// Mueve la hoja de vida de candidatos/{codigo}/hoja_vida
// a practicantes/{codigo}/hoja_vida cuando el candidato pasa a ser practicante.
//
// - Es idempotente: si ya está en la carpeta del practicante no hace nada.
// - Nunca lanza por "no hay nada que mover"; solo lanza si el movimiento falla.
// - Si falla la actualización en BD, devuelve el archivo a su sitio original.
// - Si el archivo ya fue archivado en Drive (sin copia local) lo deja como está.
import {
    moverArchivo,
    existeArchivoLocal,
    rutaDesdeUrl,
    rutas
} from "../../../infraestructura/external/storageService.js";

export const moverHojaVidaAPracticante = async ({
    candidato,
    archivoRepository,
    simular = false
}) => {

    if (!candidato?.hoja_vida_archivo_id || !candidato?.codigo) {
        return { movido: false, motivo: "El candidato no tiene hoja de vida" };
    }

    const archivo = await archivoRepository.findById(
        candidato.hoja_vida_archivo_id
    );

    if (!archivo) {
        return { movido: false, motivo: "Archivo no encontrado en la BD" };
    }

    const rutaActual = archivo.public_id || rutaDesdeUrl(archivo.url);

    if (!rutaActual) {
        return { movido: false, motivo: "El archivo no está en el disco local" };
    }

    const carpetaDestino = rutas.practicante(candidato.codigo, "hoja_vida");

    if (rutaActual.startsWith(`${carpetaDestino}/`)) {
        return { movido: false, motivo: "Ya está en la carpeta del practicante" };
    }

    if (archivo.archivado || !(await existeArchivoLocal(rutaActual))) {
        return { movido: false, motivo: "Sin copia local (archivado en Drive o inexistente)" };
    }

    if (simular) {
        return { movido: false, simulado: true, desde: rutaActual, hacia: carpetaDestino };
    }

    const nuevo = await moverArchivo(rutaActual, carpetaDestino);

    try {
        await archivoRepository.update(archivo.id, {
            url: nuevo.url,
            public_id: nuevo.public_id
        });
    } catch (error) {
        // La BD no se actualizó: devolver el archivo a donde estaba
        const carpetaOriginal = rutaActual.split("/").slice(0, -1).join("/");
        await moverArchivo(nuevo.public_id, carpetaOriginal).catch(() => {});
        throw error;
    }

    return { movido: true, desde: rutaActual, hacia: nuevo.public_id };
};
