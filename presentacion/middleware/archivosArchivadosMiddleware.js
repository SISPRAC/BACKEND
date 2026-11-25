// presentacion/middleware/archivosArchivadosMiddleware.js
//
// Va ANTES de express.static en "/uploads". Si el archivo está en disco no hace
// nada (lo sirve static como siempre). Si no está pero la BD lo marca como
// `archivado`, lo trae de Google Drive en streaming y lo entrega con la misma URL.
// Así los links guardados en la BD nunca se rompen al liberar espacio local.
import path from "path";
import { UPLOADS_ROOT, existeArchivoLocal } from "../../infraestructura/external/storageService.js";
import * as driveService from "../../infraestructura/external/GoogleDrive/driveService.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";

// Con 600 MB de RAM y 0.5 vCPU conviene limitar las descargas simultáneas desde Drive
const MAX_SIMULTANEAS = Number(process.env.DRIVE_MAX_DESCARGAS_SIMULTANEAS ?? 3);
let activas = 0;

const MIME_POR_EXTENSION = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
};

export const servirArchivoArchivado = async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();

    let ruta;
    try {
        ruta = decodeURIComponent(req.path).replace(/^\/+/, "");
    } catch {
        return next();
    }
    if (!ruta || ruta.split("/").includes("..")) return next();

    try {
        // 1) Si está en disco, que lo sirva express.static
        if (await existeArchivoLocal(ruta)) return next();

        // 2) Si no, ¿está archivado en Drive?
        const archivo = await archivoRepository.findArchivadoPorPublicId(ruta);
        if (!archivo?.drive_file_id) return next(); // 404 normal

        if (!driveService.driveConfigurado()) {
            return res.status(503).json({ message: "ARCHIVO_ARCHIVADO_NO_DISPONIBLE" });
        }
        if (activas >= MAX_SIMULTANEAS) {
            res.setHeader("Retry-After", "5");
            return res.status(503).json({ message: "SERVIDOR_OCUPADO_REINTENTE" });
        }

        activas++;
        let liberado = false;
        const liberar = () => {
            if (liberado) return;
            liberado = true;
            activas--;
        };

        try {
            const { stream, mimeType, size } = await driveService.descargarArchivo(archivo.drive_file_id);

            const porExtension = MIME_POR_EXTENSION[path.extname(ruta).toLowerCase()];
            res.setHeader("Content-Type", porExtension ?? mimeType);
            if (size) res.setHeader("Content-Length", String(size));
            res.setHeader("X-Content-Type-Options", "nosniff");
            res.setHeader("Cache-Control", "private, max-age=3600");
            res.setHeader(
                "Content-Disposition",
                `inline; filename*=UTF-8''${encodeURIComponent(archivo.nombre ?? path.basename(ruta))}`
            );

            if (req.method === "HEAD") {
                stream.destroy();
                liberar();
                return res.end();
            }

            res.on("close", () => {
                stream.destroy();
                liberar();
            });
            stream.on("error", (error) => {
                console.error(`Error sirviendo archivo archivado ${archivo.id}:`, error.message);
                liberar();
                res.destroy(error);
            });
            stream.pipe(res);
        } catch (error) {
            liberar();
            throw error;
        }
    } catch (error) {
        console.error(`No se pudo traer ${ruta} desde Drive:`, error.message);
        if (!res.headersSent) {
            return res.status(502).json({ message: "NO_SE_PUDO_OBTENER_ARCHIVO_ARCHIVADO" });
        }
    }
};
