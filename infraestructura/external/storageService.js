// infraestructura/external/storageService.js
//
// Almacenamiento de archivos en DISCO LOCAL (reemplaza a Supabase Storage).
//
// Variables de entorno:
//   UPLOADS_DIR   carpeta raíz donde se guardan los archivos (por defecto ./uploads).
//                 En producción apúntala a un volumen persistente.
//   PUBLIC_URL    URL pública de este backend, sin "/" final
//                 (ej. https://mi-api.onrender.com). Se usa para armar la URL
//                 que se guarda en la BD. Por defecto http://localhost:PORT.
//
// La API pública (uploadArchivo / deleteArchivo / descargarArchivoStream)
// es la misma que tenía la versión de Supabase, así que los casos de uso
// no cambian salvo en la `carpeta` que reciben (ver `rutas` más abajo).
//
// Estructura en disco:
//   uploads/
//   ├── candidatos/{codigo}/hoja_vida/     (solo mientras sigue siendo candidato)
//   ├── practicantes/{codigo}/
//   │   ├── hoja_vida/      la hoja de vida se mueve aquí al aceptar la postulación
//   │   ├── requisitos/     documentos de requisitos que sube el practicante
//   │   ├── informes/       entregas de informes
//   │   ├── retiros/        soportes de retiro
//   │   └── certificado_finalizacion/
//   ├── empresas/{empresa_id}/
//   │   ├── logo/
//   │   ├── convenios/
//   │   ├── requisitos/     documentos de requisitos de la empresa
//   │   └── arl/{practica_id}/
//   ├── visitas/{visita_id}/{fotografias|acta}/
//   └── sistema/{plantillas_informes|plantillas_requisitos}/   (cosas de admin)
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { createHash } from "crypto";

/* global fetch */

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

export const UPLOADS_ROOT = path.resolve(
    process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads")
);

const baseUrlPublica = () =>
    (
        process.env.PUBLIC_URL ||
        `http://localhost:${process.env.PORT || 3000}`
    ).replace(/\/+$/, "");

const PREFIJO_URL = "/uploads/";

// ---------------------------------------------------------------------------
// Helpers de nombres / rutas
// ---------------------------------------------------------------------------

const sanitizarNombreArchivo = (nombre) =>
    String(nombre)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");

// Cada segmento de carpeta se limpia: sin acentos, sin "..", sin separadores.
const sanitizarSegmento = (segmento) => {
    const limpio = sanitizarNombreArchivo(segmento)
        .replace(/^\.+/, "")
        .replace(/^_+$/, "");
    return limpio;
};

const sanitizarCarpeta = (carpeta) =>
    String(carpeta ?? "")
        .split(/[\\/]+/)
        .map(sanitizarSegmento)
        .filter(Boolean)
        .join("/");

// Convierte una ruta relativa (public_id) en ruta absoluta, garantizando que
// nunca salga de UPLOADS_ROOT (evita path traversal).
const rutaAbsoluta = (rutaRelativa) => {
    const absoluta = path.resolve(UPLOADS_ROOT, rutaRelativa);

    if (
        absoluta !== UPLOADS_ROOT &&
        !absoluta.startsWith(UPLOADS_ROOT + path.sep)
    ) {
        throw new Error("Ruta de archivo no permitida");
    }

    return absoluta;
};

// Rutas estándar. Úsalas al llamar a uploadArchivo para mantener el orden.
export const rutas = {
    candidato: (codigo, sub = "hoja_vida") =>
        `candidatos/${codigo}/${sub}`,

    practicante: (codigo, sub) =>
        `practicantes/${codigo}/${sub}`,

    empresa: (empresaId, sub) =>
        `empresas/${empresaId}/${sub}`,

    practica: (practicaId, sub) =>
        `practicas/${practicaId}/${sub}`,

    visita: (visitaId, sub) =>
        `visitas/${visitaId}/${sub}`,

    sistema: (sub) =>
        `sistema/${sub}`,
};

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export const urlDesdeRuta = (rutaRelativa) =>
    `${baseUrlPublica()}${PREFIJO_URL}${rutaRelativa
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;

// Devuelve la ruta relativa (public_id) a partir de una URL local, o null si
// la URL no apunta a este almacenamiento (p. ej. una URL vieja de Supabase).
export const rutaDesdeUrl = (url) => {
    const texto = String(url ?? "");
    const indice = texto.indexOf(PREFIJO_URL);

    if (indice === -1) return null;

    try {
        return decodeURIComponent(
            texto.slice(indice + PREFIJO_URL.length).split(/[?#]/)[0]
        );
    } catch {
        return null;
    }
};

// Guarda un buffer exactamente en `rutaRelativa` (sin renombrar). Lo usa
// uploadArchivo y el script de migración desde Supabase.
export const guardarArchivo = async (buffer, rutaRelativa) => {

    if (!Buffer.isBuffer(buffer)) {
        throw new Error("El archivo no es válido");
    }

    const destino = rutaAbsoluta(rutaRelativa);

    await fs.promises.mkdir(path.dirname(destino), { recursive: true });

    // flag "wx": falla si ya existe (equivale al upsert:false de Supabase)
    await fs.promises.writeFile(destino, buffer, { flag: "wx" });

    return {
        url: urlDesdeRuta(rutaRelativa),
        public_id: rutaRelativa,
        resource_type: "local",
    };
};

export const sanitizarRuta = (carpeta, nombre) => {

    const nombreSeguro = sanitizarNombreArchivo(nombre);

    const carpetaSegura = sanitizarCarpeta(carpeta);

    if (!carpetaSegura) {
        throw new Error("La carpeta de almacenamiento no es válida");
    }

    return { carpetaSegura, nombreSeguro };
};

// `mimeType` se conserva en la firma por compatibilidad con la versión de
// Supabase; en disco el tipo se deduce de la extensión.
// eslint-disable-next-line no-unused-vars
export const uploadArchivo = async (buffer, carpeta, nombre, mimeType) => {

    const { carpetaSegura, nombreSeguro } = sanitizarRuta(carpeta, nombre);

    const extension = nombreSeguro.includes(".")
        ? "." + nombreSeguro.split(".").pop()
        : "";

    const nombreSinExtension = extension
        ? nombreSeguro.slice(0, -extension.length)
        : nombreSeguro;

    const nombreUnico =
        `${nombreSinExtension}_${Date.now()}${extension}`;

    return guardarArchivo(buffer, `${carpetaSegura}/${nombreUnico}`);
};

export const deleteArchivo = async (publicId) => {

    if (!publicId) return;

    const destino = rutaAbsoluta(publicId);

    try {
        await fs.promises.unlink(destino);
    } catch (error) {
        // Si ya no existe no es un error: el objetivo (que no esté) se cumple.
        if (error.code !== "ENOENT") throw error;
        return;
    }

    // Limpia carpetas que hayan quedado vacías (sin tocar la raíz).
    let carpeta = path.dirname(destino);

    while (carpeta !== UPLOADS_ROOT && carpeta.startsWith(UPLOADS_ROOT)) {
        try {
            await fs.promises.rmdir(carpeta); // solo borra si está vacía
        } catch {
            break;
        }
        carpeta = path.dirname(carpeta);
    }
};

// Borra (de abajo hacia arriba) las carpetas que hayan quedado vacías, sin
// tocar la raíz de uploads.
const limpiarCarpetasVacias = async (carpetaAbsoluta) => {
    let carpeta = carpetaAbsoluta;

    while (carpeta !== UPLOADS_ROOT && carpeta.startsWith(UPLOADS_ROOT)) {
        try {
            await fs.promises.rmdir(carpeta); // solo borra si está vacía
        } catch {
            break;
        }
        carpeta = path.dirname(carpeta);
    }
};

// Mueve un archivo ya guardado a otra carpeta conservando su nombre.
// Devuelve la nueva { url, public_id } para actualizar la tabla Archivos.
// No sobrescribe: si ya hay un archivo con ese nombre en el destino, falla.
export const moverArchivo = async (rutaOrigen, carpetaDestino) => {

    const carpetaSegura = sanitizarCarpeta(carpetaDestino);

    if (!carpetaSegura) {
        throw new Error("La carpeta de almacenamiento no es válida");
    }

    const origen = rutaAbsoluta(rutaOrigen);
    const rutaNueva = `${carpetaSegura}/${path.basename(origen)}`;
    const destino = rutaAbsoluta(rutaNueva);

    if (origen !== destino) {

        await fs.promises.mkdir(path.dirname(destino), { recursive: true });

        // Evita pisar un archivo existente
        try {
            await fs.promises.access(destino);
            throw new Error("Ya existe un archivo en la carpeta de destino");
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }

        try {
            await fs.promises.rename(origen, destino);
        } catch (error) {
            // Distintos discos/volúmenes: copiar y luego borrar
            if (error.code !== "EXDEV") throw error;
            await fs.promises.copyFile(origen, destino);
            await fs.promises.unlink(origen);
        }

        await limpiarCarpetasVacias(path.dirname(origen));
    }

    return {
        url: urlDesdeRuta(rutaNueva),
        public_id: rutaNueva,
    };
};

const MIME_POR_EXTENSION = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
};

// Abre un archivo ya subido (por su URL) como stream, para copiarlo a otro
// destino (respaldo a Drive). Si la URL es local lo lee del disco; si es una
// URL antigua (Supabase aún sin migrar) lo descarga por HTTP.
export const descargarArchivoStream = async (url) => {

    const ruta = rutaDesdeUrl(url);

    if (ruta) {
        const absoluta = rutaAbsoluta(ruta);

        await fs.promises.access(absoluta, fs.constants.R_OK);

        return {
            stream: fs.createReadStream(absoluta),
            mimeType:
                MIME_POR_EXTENSION[path.extname(absoluta).toLowerCase()] ??
                "application/octet-stream",
        };
    }

    const respuesta = await fetch(url);

    if (!respuesta.ok || !respuesta.body) {
        throw new Error(`No se pudo descargar ${url} (HTTP ${respuesta.status})`);
    }

    return {
        stream: Readable.fromWeb(respuesta.body),
        mimeType:
            respuesta.headers.get("content-type") ??
            "application/octet-stream",
    };
};

// ---------------------------------------------------------------------------
// Liberación de espacio local (archivos ya respaldados en Drive)
// ---------------------------------------------------------------------------

// Tamaño y md5 del archivo local (md5 calculado en streaming, sin cargarlo en
// memoria). Devuelve null si el archivo no existe en disco.
export const infoArchivoLocal = async (rutaRelativa) => {
    let absoluta;
    try {
        absoluta = rutaAbsoluta(rutaRelativa);
        const stat = await fs.promises.stat(absoluta);
        if (!stat.isFile()) return null;

        const hash = createHash("md5");
        await new Promise((resolve, reject) => {
            fs.createReadStream(absoluta)
                .on("data", (chunk) => hash.update(chunk))
                .on("end", resolve)
                .on("error", reject);
        });
        return { size: stat.size, md5: hash.digest("hex") };
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "ENOTDIR") return null;
        throw error;
    }
};

// ¿Existe el archivo en disco? (barato: solo un stat)
export const existeArchivoLocal = async (rutaRelativa) => {
    try {
        const stat = await fs.promises.stat(rutaAbsoluta(rutaRelativa));
        return stat.isFile();
    } catch {
        return false;
    }
};
