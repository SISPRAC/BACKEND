// infraestructura/jobs/respaldarPeriodosJob.js
import cron from "node-cron";
import { periodoRepository } from "../repositorios/periodoRepositoryImpl.js";
import { periodoRespaldoRepository } from "../repositorios/periodoRespaldoRepositoryImpl.js";
import * as driveService from "../external/GoogleDrive/driveService.js";
import { descargarArchivoStream, rutaDesdeUrl, infoArchivoLocal, deleteArchivo } from "../external/storageService.js";
import { archivoRepository } from "../repositorios/archivoRepositoryImpl.js";
import { respaldarPeriodo } from "../../aplicacion/casos_de_uso/periodoRespaldo/respaldarPeriodo.js";
import { comprimirPeriodoAntiguo } from "../../aplicacion/casos_de_uso/periodoRespaldo/comprimirPeriodoAntiguo.js";
import { liberarEspacioLocalPeriodo } from "../../aplicacion/casos_de_uso/periodoRespaldo/liberarEspacioLocalPeriodo.js";

// Configurable por entorno
const CRON = process.env.RESPALDO_CRON ?? "0 2 * * *"; // todos los días 02:00 Colombia
const MAX_INTENTOS = Number(process.env.RESPALDO_MAX_INTENTOS ?? 5);
const DIAS_ANTIGUEDAD = Number(process.env.RESPALDO_DIAS_ANTIGUEDAD_COMPRESION ?? 365);
const ELIMINAR_ORIGINAL = process.env.RESPALDO_ELIMINAR_ORIGINAL_TRAS_COMPRIMIR === "true";

// Paso 3: liberar espacio local. APAGADO por defecto.
//   RESPALDO_LIBERAR_LOCAL=true            enciende el paso 3
//   RESPALDO_LIBERAR_LOCAL_SIMULACION      por defecto "true": solo escribe en el log qué borraría.
//                                          Ponlo en "false" para borrar de verdad.
const LIBERAR_LOCAL = process.env.RESPALDO_LIBERAR_LOCAL === "true";
const LIBERAR_SIMULACION = process.env.RESPALDO_LIBERAR_LOCAL_SIMULACION !== "false";
const DIAS_LIBERAR_LOCAL = Number(process.env.RESPALDO_DIAS_LIBERAR_LOCAL ?? 180);
const LOTE_LIBERAR = Number(process.env.RESPALDO_LIBERAR_LOTE ?? 200); // máx. archivos por corrida

let ejecutando = false; // evita solapamiento si una corrida tarda

// Un ciclo completo: primero sube, luego comprime. Cada período va aislado;
// el error de uno ya queda registrado en PeriodoRespaldos y no frena a los demás.
export const ejecutarCicloRespaldo = async () => {
    const resumen = {
        subidos: 0, subidasFallidas: 0, comprimidos: 0, compresionesFallidas: 0,
        liberados: 0, mbLiberados: 0, liberacionesFallidas: 0,
    };

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

    // Paso 3: liberar espacio local (solo períodos viejos, ya verificados en Drive)
    if (LIBERAR_LOCAL) {
        if (ELIMINAR_ORIGINAL) {
            // Si la carpeta de Drive va a la papelera (se borra sola a los 30 días) los
            // archivos "archivados" quedarían sin copia accesible. Se evita.
            console.warn(
                "Liberación de espacio local OMITIDA: RESPALDO_ELIMINAR_ORIGINAL_TRAS_COMPRIMIR=true " +
                "mandaría a la papelera las copias de Drive. Pon esa variable en false."
            );
        } else {
            let cupo = LOTE_LIBERAR;
            const porLiberar = await periodoRespaldoRepository.periodosPendientesDeLiberacion({
                maxIntentos: MAX_INTENTOS,
                diasAntiguedad: DIAS_LIBERAR_LOCAL,
            });
            for (const periodo of porLiberar) {
                if (cupo <= 0) break;
                try {
                    const r = await liberarEspacioLocalPeriodo({
                        periodoId: periodo.id,
                        periodoRepository,
                        periodoRespaldoRepository,
                        archivoRepository,
                        driveService,
                        storage: { rutaDesdeUrl, infoArchivoLocal, deleteArchivo },
                        dryRun: LIBERAR_SIMULACION,
                        limite: cupo,
                    });
                    cupo -= r.liberados ?? 0;
                    resumen.liberados += r.liberados ?? 0;
                    resumen.mbLiberados += r.mb ?? 0;

                    if (LIBERAR_SIMULACION) {
                        console.log(
                            `[SIMULACIÓN] Período ${periodo.nombre}: borraría ${r.liberados} archivos (${r.mb} MB). ` +
                            `Sin verificar: ${r.noVerificados}. No se borró nada.`
                        );
                    } else {
                        console.log(
                            `Período ${periodo.nombre}: liberados ${r.liberados} archivos (${r.mb} MB). ` +
                            `Sin verificar: ${r.noVerificados}. Pendientes: ${r.restantes}.`
                        );
                    }
                } catch (error) {
                    resumen.liberacionesFallidas++;
                    console.error(`Error liberando espacio del período ${periodo.nombre}:`, error.message);
                }
            }
            resumen.mbLiberados = Number(resumen.mbLiberados.toFixed(2));
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
