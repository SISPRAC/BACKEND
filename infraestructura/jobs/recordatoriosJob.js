// infraestructura/jobs/recordatoriosJob.js
import cron from "node-cron";
import { ejecutarRecordatorios } from "../../aplicacion/casos_de_uso/recordatorio/ejecutarRecordatorios.js";
import { reglaEncuestaPendiente } from "../../aplicacion/casos_de_uso/recordatorio/reglas/encuestaPendiente.js";
import { recordatorioRepository } from "../repositorios/recordatorioRepositoryImpl.js";
import { notificacionRepository } from "../repositorios/notificacionRepositoryImpl.js"; // ← ajusta

let ejecutando = false;

export const iniciarRecordatorios = () => {
    cron.schedule("0 8 * * *", async () => {
        if (ejecutando) return;
        ejecutando = true;
        try {
            console.log("Ejecutando recordatorios...");
            await ejecutarRecordatorios({
                reglas: [
                    reglaEncuestaPendiente({ recordatorioRepository, notificacionRepository }),
                    // aquí se agregan las demás
                ]
            });
            console.log("Recordatorios completados");
        } catch (error) {
            console.error("Error en recordatorios:", error);
        } finally {
            ejecutando = false;
        }
    }, { timezone: "America/Bogota" });
};