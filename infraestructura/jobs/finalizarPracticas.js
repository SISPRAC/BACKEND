// infraestructura/cron/finalizarPracticas.js
import cron from "node-cron";
import { practicaRepository } from "../repositorios/practicaRepositoryImpl.js";
import { practicaPracticanteRepository } from "../repositorios/PracticaPracticanteRepositoryImpl.js";
import { aperturaVacanteRepository } from "../repositorios/aperturaVacanteRepositoryImpl.js";
import { notificacionRepository } from "../repositorios/notificacionRepositoryImpl.js";
import { finalizarPracticasVencidas } from "../../aplicacion/casos_de_uso/practica/finalizarPracticasVencidas.js";
import { userRepository } from "../repositorios/userRepositoryImpl.js";

let ejecutando = false; // evita solapamiento si una corrida tarda

export const iniciarFinalizacionPracticas = () => {
    // Todos los días a las 00:05 hora Colombia
    cron.schedule("10 6 * * *", async () => {
        if (ejecutando) return;
        ejecutando = true;

        try {
            console.log("Revisando prácticas vencidas...");
            const resumen = await finalizarPracticasVencidas({
                practicaRepository,
                practicaPracticanteRepository,
                aperturaVacanteRepository,
                 userRepository,  
                notificacionRepository,
            });
            console.log("Finalización de prácticas completada:", resumen);
        } catch (error) {
            console.error("Error al finalizar prácticas:", error);
        } finally {
            ejecutando = false;
        }
    }, { timezone: "America/Bogota" });
};