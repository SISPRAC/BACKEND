// infraestructura/external/GoogleDrive/driveService.js
//
// Cliente de Google Drive con OAuth2 + refresh token.
// El access token (dura ~1 h) se renueva solo con el refresh token; no hay
// que gestionarlo a mano.
//
// Variables de entorno:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN   (obligatorias)
//   GOOGLE_DRIVE_ROOT_FOLDER_ID   carpeta raíz de los respaldos (opcional; si falta, "Mi unidad")
//
// El refresh token debe generarse con el scope https://www.googleapis.com/auth/drive
// (con drive.file no se puede escribir en una carpeta raíz creada a mano).
import { google } from "googleapis";
import * as archiverModule from "archiver";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

// archiver v8 exporta la clase ZipArchive; v7 y anteriores exportan una función.
// Así funciona con cualquiera de las dos.
const crearZip = (opciones) =>
    archiverModule.ZipArchive
        ? new archiverModule.ZipArchive(opciones)
        : archiverModule.default("zip", opciones);

const MIME_CARPETA = "application/vnd.google-apps.folder";
const CAMPOS_ARCHIVO = "id, name, mimeType, webViewLink, size, md5Checksum";

let drive = null;

export const driveConfigurado = () =>
    Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_REFRESH_TOKEN
    );

// Cliente perezoso: no rompe el arranque si Drive no está configurado.
const getDrive = () => {
    if (drive) return drive;

    if (!driveConfigurado()) {
        throw new Error(
            "Google Drive no está configurado (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)"
        );
    }

    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    drive = google.drive({ version: "v3", auth });
    return drive;
};

// invalid_grant = refresh token revocado o vencido (típico con la app OAuth en
// modo "Testing", donde el token caduca a los 7 días). Mensaje claro para el admin.
const envolverError = (error) => {
    const detalle = error?.response?.data?.error ?? error?.message;
    if (detalle === "invalid_grant" || /invalid_grant/.test(String(error?.message))) {
        return new Error(
            "El refresh token de Google es inválido o expiró (invalid_grant). Genera uno nuevo y actualiza GOOGLE_REFRESH_TOKEN."
        );
    }
    return error;
};

const conManejoDeError = async (fn) => {
    try {
        return await fn();
    } catch (error) {
        throw envolverError(error);
    }
};

const escaparQuery = (valor) => String(valor).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const padreRaiz = (padreId) =>
    padreId ?? process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ?? "root";

// Lista los hijos directos de una carpeta (maneja paginación).
export async function listarHijos(carpetaId) {
    return conManejoDeError(async () => {
        const hijos = [];
        let pageToken;
        do {
            const { data } = await getDrive().files.list({
                q: `'${escaparQuery(carpetaId)}' in parents and trashed = false`,
                fields: `nextPageToken, files(${CAMPOS_ARCHIVO})`,
                pageSize: 1000,
                pageToken,
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
            });
            hijos.push(...data.files);
            pageToken = data.nextPageToken;
        } while (pageToken);
        return hijos;
    });
}

// Crea una carpeta. Es idempotente: si ya existe una con ese nombre dentro del
// padre la devuelve en vez de duplicarla (así un reintento no deja carpetas repetidas).
export async function crearCarpeta({ nombre, padreId }) {
    return conManejoDeError(async () => {
        const padre = padreRaiz(padreId);

        const { data: existentes } = await getDrive().files.list({
            q: `name = '${escaparQuery(nombre)}' and mimeType = '${MIME_CARPETA}' and '${escaparQuery(padre)}' in parents and trashed = false`,
            fields: `files(${CAMPOS_ARCHIVO})`,
            pageSize: 1,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });
        if (existentes.files.length) return existentes.files[0];

        const { data } = await getDrive().files.create({
            requestBody: { name: nombre, mimeType: MIME_CARPETA, parents: [padre] },
            fields: CAMPOS_ARCHIVO,
            supportsAllDrives: true,
        });
        return data; // { id, name, mimeType, webViewLink }
    });
}

// Sube un archivo desde un stream (`stream`) o desde disco (`rutaLocal`).
export async function subirArchivo({ stream, rutaLocal, nombre, carpetaId, mimeType }) {
    return conManejoDeError(async () => {
        const { data } = await getDrive().files.create({
            requestBody: { name: nombre, parents: [padreRaiz(carpetaId)] },
            media: {
                mimeType: mimeType ?? "application/octet-stream",
                body: stream ?? fs.createReadStream(rutaLocal),
            },
            fields: CAMPOS_ARCHIVO,
            supportsAllDrives: true,
        });
        return data; // { id, name, mimeType, webViewLink } -> lo que se guarda en la tabla
    });
}

// Lista todos los archivos (no carpetas) bajo una carpeta, recursivamente,
// con su ruta relativa dentro de ella.
export const listarArchivosRecursivo = async (carpetaId, prefijo = "") => {
    const resultado = [];
    for (const hijo of await listarHijos(carpetaId)) {
        if (hijo.mimeType === MIME_CARPETA) {
            resultado.push(...await listarArchivosRecursivo(hijo.id, `${prefijo}${hijo.name}/`));
        } else {
            resultado.push({
                id: hijo.id,
                ruta: `${prefijo}${hijo.name}`,
                size: hijo.size !== undefined ? Number(hijo.size) : null,
                md5: hijo.md5Checksum ?? null,
            });
        }
    }
    return resultado;
};

// Drive no comprime en el servidor: se descarga cada archivo en streaming, se
// arma el .zip en un temporal en disco (sin cargar todo en memoria) y se sube.
// Devuelve el archivo .zip creado en Drive. No borra la carpeta original.
export async function comprimirCarpeta({ carpetaId, nombreZip, destinoId }) {
    return conManejoDeError(async () => {
        const destino = padreRaiz(destinoId);

        // Si una corrida anterior subió el zip pero no alcanzó a registrarlo, se reutiliza.
        const { data: existentes } = await getDrive().files.list({
            q: `name = '${escaparQuery(nombreZip)}' and '${escaparQuery(destino)}' in parents and trashed = false`,
            fields: `files(${CAMPOS_ARCHIVO})`,
            pageSize: 1,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });
        if (existentes.files.length) return existentes.files[0];

        const archivos = await listarArchivosRecursivo(carpetaId);
        const rutaTemporal = path.join(os.tmpdir(), `respaldo_${randomUUID()}.zip`);

        try {
            const archive = crearZip({ zlib: { level: 1 } });
            const salida = fs.createWriteStream(rutaTemporal);
            const cerrado = new Promise((resolve, reject) => {
                salida.on("close", resolve);
                salida.on("error", reject);
                archive.on("error", reject);
            });
            archive.pipe(salida);

            const usados = new Set();
            try {
                for (const { id, ruta } of archivos) {
                    let nombre = ruta;
                    for (let n = 1; usados.has(nombre); n++) nombre = `${n}_${ruta}`;
                    usados.add(nombre);

                    const { data: stream } = await getDrive().files.get(
                        { fileId: id, alt: "media", supportsAllDrives: true },
                        { responseType: "stream" }
                    );

                    // Se espera a que el zip consuma cada archivo antes de pedir el siguiente
                    await new Promise((resolve, reject) => {
                        const alEntrar = (entry) => {
                            if (entry.name !== nombre) return;
                            archive.off("entry", alEntrar);
                            resolve();
                        };
                        archive.on("entry", alEntrar);
                        stream.on("error", reject);
                        archive.append(stream, { name: nombre });
                    });
                }
                await archive.finalize();
                await cerrado;
            } catch (error) {
                archive.abort();
                salida.destroy();
                throw error;
            }

            return await subirArchivo({
                rutaLocal: rutaTemporal,
                nombre: nombreZip,
                carpetaId: destino,
                mimeType: "application/zip",
            });
        } finally {
            await fs.promises.rm(rutaTemporal, { force: true });
        }
    });
}

// Mueve un archivo/carpeta a la papelera de Drive (recuperable 30 días).
export async function moverAPapelera(fileId) {
    return conManejoDeError(async () => {
        await getDrive().files.update({
            fileId,
            requestBody: { trashed: true },
            supportsAllDrives: true,
        });
    });
}

// Abre un archivo de Drive como stream (para servirlo sin guardarlo en disco).
// Devuelve { stream, mimeType, size }.
export async function descargarArchivo(fileId) {
    return conManejoDeError(async () => {
        const { data: meta } = await getDrive().files.get({
            fileId,
            fields: "id, mimeType, size, trashed",
            supportsAllDrives: true,
        });
        if (meta.trashed) throw new Error("El archivo está en la papelera de Drive");

        const { data: stream } = await getDrive().files.get(
            { fileId, alt: "media", supportsAllDrives: true },
            { responseType: "stream" }
        );
        return {
            stream,
            mimeType: meta.mimeType ?? "application/octet-stream",
            size: meta.size !== undefined ? Number(meta.size) : null,
        };
    });
}
