// infraestructura/jobs/respaldarPeriodosJob.js
import cron from "node-cron";
import { periodoRepository } from "../repositorios/periodoRepositoryImpl.js";
import { periodoRespaldoRepository } from "../repositorios/periodoRespaldoRepositoryImpl.js";
import * as driveService from "../external/GoogleDrive/driveService.js";
import { descargarArchivoStream } from "../external/storageService.js";
import { respaldarPeriodo } from "../../aplicacion/casos_de_uso/periodoRespaldo/respaldarPeriodo.js";
import { comprimirPeriodoAntiguo } from "../../aplicacion/casos_de_uso/periodoRespaldo/comprimirPeriodoAntiguo.js";

// Configurable por entorno
const CRON = process.env.RESPALDO_CRON ?? "0 2 * * *"; // todos los días 02:00 Colombia
const MAX_INTENTOS = Number(process.env.RESPALDO_MAX_INTENTOS ?? 5);
const DIAS_ANTIGUEDAD = Number(process.env.RESPALDO_DIAS_ANTIGUEDAD_COMPRESION ?? 365);
const ELIMINAR_ORIGINAL = process.env.RESPALDO_ELIMINAR_ORIGINAL_TRAS_COMPRIMIR === "true";

let ejecutando = false; // evita solapamiento si una corrida tarda

// Un ciclo completo: primero sube, luego comprime. Cada período va aislado;
// el error de uno ya queda registrado en PeriodoRespaldos y no frena a los demás.
export const ejecutarCicloRespaldo = async () => {
    const resumen = { subidos: 0, subidasFallidas: 0, comprimidos: 0, compresionesFallidas: 0 };

    const porSubir = await periodoRespaldoRepository.periodosPendientesDeSubida({
        maxIntentos: MAX_INTENTOS,
    });
    for (const periodo of porSubir) {
        try {
            await respaldarPeriodo({
                periodoId: periodo.id,
                periodoRepository,
                periodoRespaldoRepository,
                driveService,
                descargarArchivoStream,
            });
            resumen.subidos++;
        } catch (error) {
            resumen.subidasFallidas++;
            console.error(`Error respaldando período ${periodo.nombre}:`, error.message);
        }
    }

    const porComprimir = await periodoRespaldoRepository.periodosPendientesDeCompresion({
        maxIntentos: MAX_INTENTOS,
        diasAntiguedad: DIAS_ANTIGUEDAD,
    });
    for (const periodo of porComprimir) {
        try {
            await comprimirPeriodoAntiguo({
                periodoId: periodo.id,
                periodoRepository,
                periodoRespaldoRepository,
                driveService,
                eliminarOriginal: ELIMINAR_ORIGINAL,
            });
            resumen.comprimidos++;
        } catch (error) {
            resumen.compresionesFallidas++;
            console.error(`Error comprimiendo período ${periodo.nombre}:`, error.message);
        }
    }

    return resumen;
};

export const iniciarRespaldoPeriodos = () => {
    if (!driveService.driveConfigurado()) {
        console.warn(
            "Respaldo de períodos desactivado: faltan GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN"
        );
        return;
    }

    cron.schedule(CRON, async () => {
        if (ejecutando) return;
        ejecutando = true;

        try {
            console.log("Revisando períodos pendientes de respaldo...");
            const resumen = await ejecutarCicloRespaldo();
            console.log("Respaldo de períodos completado:", resumen);
        } catch (error) {
            console.error("Error en el respaldo de períodos:", error);
        } finally {
            ejecutando = false;
        }
    }, { timezone: "America/Bogota" });
};
