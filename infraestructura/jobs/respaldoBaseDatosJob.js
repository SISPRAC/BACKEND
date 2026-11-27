// backend/infraestructura/jobs/respaldoBaseDatosJob.js
//
// Respaldo diario de la BASE DE DATOS: pg_dump -> .sql.gz -> carpeta "Respaldos_BD" en Drive.
// Reutiliza driveService (mismas credenciales GOOGLE_* que el respaldo de períodos).
//
// Variables de entorno (todas opcionales):
//   RESPALDO_BD_CRON        por defecto "0 1 * * *" (todos los días 01:00 Colombia)
//   RESPALDO_BD_CONSERVAR   cuántos respaldos dejar en Drive (por defecto 14)
//   RESPALDO_BD_CARPETA     nombre de la carpeta en Drive (por defecto "Respaldos_BD")
import cron from "node-cron";
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import zlib from "zlib";
import { pipeline } from "stream/promises";
import * as driveService from "../external/GoogleDrive/driveService.js";

const CRON = process.env.RESPALDO_BD_CRON ?? "0 1 * * *";
const CONSERVAR = Number(process.env.RESPALDO_BD_CONSERVAR ?? 14);
const NOMBRE_CARPETA = process.env.RESPALDO_BD_CARPETA ?? "Respaldos_BD";
const PREFIJO = "sisprac_bd_";

let ejecutando = false;

const volcarBaseDeDatos = (rutaSalida) =>
    new Promise((resolve, reject) => {
        const proc = spawn(
            "pg_dump",
            ["--no-owner", "--no-acl", process.env.DATABASE_URL],
            { env: { ...process.env, ...(process.env.DB_SSL === "true" ? { PGSSLMODE: "require" } : {}) } }
        );

        let stderr = "";
        proc.stderr.on("data", (d) => { stderr += d; });
        proc.on("error", reject); // p. ej. pg_dump no instalado

        const escritura = pipeline(proc.stdout, zlib.createGzip(), fs.createWriteStream(rutaSalida));
        escritura.catch(reject);

        proc.on("close", async (code) => {
            if (code !== 0) return reject(new Error(`pg_dump terminó con código ${code}: ${stderr.trim()}`));
            try { await escritura; resolve(); } catch (e) { reject(e); }
        });
    });

export const ejecutarRespaldoBaseDatos = async () => {
    const marca = new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Bogota" })
        .replace(" ", "_")
        .replace(/:/g, "-");
    const nombre = `${PREFIJO}${marca}.sql.gz`;
    const ruta = path.join(os.tmpdir(), nombre);

    try {
        await volcarBaseDeDatos(ruta);

        const carpeta = await driveService.crearCarpeta({ nombre: NOMBRE_CARPETA });
        const subido = await driveService.subirArchivo({
            rutaLocal: ruta,
            nombre,
            carpetaId: carpeta.id,
            mimeType: "application/gzip",
        });

        // Rotación: se dejan solo los últimos N respaldos (los viejos van a la papelera de Drive)
        const hijos = (await driveService.listarHijos(carpeta.id))
            .filter((f) => f.name.startsWith(PREFIJO))
            .sort((a, b) => b.name.localeCompare(a.name));
        for (const viejo of hijos.slice(CONSERVAR)) {
            await driveService.moverAPapelera(viejo.id);
        }

        return { archivo: subido.name, enDrive: hijos.length };
    } finally {
        await fs.promises.rm(ruta, { force: true });
    }
};

export const iniciarRespaldoBaseDatos = () => {
    if (!driveService.driveConfigurado()) {
        console.warn("Respaldo de BD desactivado: faltan GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN");
        return;
    }

    cron.schedule(CRON, async () => {
        if (ejecutando) return;
        ejecutando = true;
        try {
            console.log("Respaldo de BD:", await ejecutarRespaldoBaseDatos());
        } catch (error) {
            console.error("Error en el respaldo de BD:", error.message);
        } finally {
            ejecutando = false;
        }
    }, { timezone: "America/Bogota" });
};
