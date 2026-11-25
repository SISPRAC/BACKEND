import { initDB } from "./infraestructura/database/dbConnection.js";

// Repositorios
import { convenioRepository } from "./infraestructura/repositorios/convenioRepositoryImpl.js";
import { historialConvenioRepository } from "./infraestructura/repositorios/historialConvenioRepositoryImpl.js";
import { empresaRepository } from "./infraestructura/repositorios/empresaRepositoryImpl.js";
import { practicaRepository } from "./infraestructura/repositorios/practicaRepositoryImpl.js";
import { practicaPracticanteRepository } from "./infraestructura/repositorios/PracticaPracticanteRepositoryImpl.js";
import { aperturaVacanteRepository } from "./infraestructura/repositorios/aperturaVacanteRepositoryImpl.js";
import { notificacionRepository } from "./infraestructura/repositorios/notificacionRepositoryImpl.js";
import { userRepository } from "./infraestructura/repositorios/userRepositoryImpl.js";

// Casos de uso / ciclo
import { vencerConvenios } from "./aplicacion/casos_de_uso/convenio/vencerConvenio.js";
import { finalizarPracticasVencidas } from "./aplicacion/casos_de_uso/practica/finalizarPracticasVencidas.js";
import { ejecutarCicloRespaldo } from "./infraestructura/jobs/respaldarPeriodosJob.js";

await initDB();

console.log("1) Convenios vencidos...");
await vencerConvenios(
    convenioRepository,
    historialConvenioRepository,
    empresaRepository,
    notificacionRepository,
    userRepository
);

console.log("2) Finalizar prácticas vencidas...");
console.log(await finalizarPracticasVencidas({
    practicaRepository,
    practicaPracticanteRepository,
    aperturaVacanteRepository,
    userRepository,
    notificacionRepository,
}));

// Va después de finalizar: el respaldo solo toma períodos sin prácticas EN_CURSO
console.log("3) Respaldo a Drive...");
console.log(await ejecutarCicloRespaldo());

process.exit(0);