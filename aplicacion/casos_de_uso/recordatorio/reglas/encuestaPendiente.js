// aplicacion/casos_de_uso/recordatorio/reglas/encuestaPendiente.js
import { fechaOffset } from "../fechas.js";
import { notificarRecordatorio } from "../notificarRecordatorio.js";

export const reglaEncuestaPendiente = ({ recordatorioRepository, notificacionRepository }) => ({
    tipo: "ENCUESTA_PENDIENTE_20D",
    buscarPendientes: () =>
        recordatorioRepository.encuestasPendientesPracticantes(fechaOffset(-20)),
    notificar: (p) => notificarRecordatorio({
        usuario: p.usuario,
        titulo: "Encuesta pendiente",
        mensaje: "Tu práctica finalizó hace 20 días y aún no has respondido la encuesta.",
        items: p.items,
        cierre: "Ingresa a SISPRAC y responde la encuesta de tu práctica.",
        notificacionRepository
    }),
});