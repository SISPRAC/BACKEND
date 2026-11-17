import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracCambioSolicitudVisitaTemplate } from "../../../infraestructura/external/email/templates/sispracCambioSolicitudVisitaTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

export const notificarCambioSolicitudVisita = async ({
    tipo,                    // "REPROGRAMADA" | "CANCELADA"
    tutores,
    nombreTutorDocente,
    fechas = [],             // solo REPROGRAMADA
    motivo = null,           // solo CANCELADA
    notificacionRepository
}) => {

    if (!tutores || tutores.length === 0) {
        console.warn(
            `[cambioSolicitudVisita:${tipo}] No hay tutores empresariales para notificar.`
        );
        return;
    }

    const esCancelada = tipo === "CANCELADA";

    const tareas = tutores.flatMap(({ usuarioTutor, nombresPracticantes }) => {

        const esPlural = nombresPracticantes.length > 1;

        const destino = esPlural
            ? `los practicantes: ${nombresPracticantes.join(", ")}`
            : `el practicante: ${nombresPracticantes[0]}`;

        const titulo = esCancelada
            ? "Solicitud de visita cancelada"
            : "Solicitud de visita reprogramada";

        const descripcion = esCancelada
            ? `El tutor docente ${nombreTutorDocente} ha cancelado la solicitud de visita para ${destino}. Motivo: ${motivo}`
            : `El tutor docente ${nombreTutorDocente} ha actualizado las fechas propuestas para la visita de ${destino}. ` +
              "La solicitud se encuentra pendiente de revisión. Por favor, revise nuevamente las disponibilidades propuestas.";

        const tareasTutor = [
            {
                tipo: "notificación interna",
                promise: crearNotificacion(
                    { notificacionRepository },
                    {
                        usuario_id: usuarioTutor.id,
                        titulo,
                        descripcion
                    }
                )
            }
        ];

        if (usuarioTutor.correo) {

            tareasTutor.push({
                tipo: "correo electrónico",
                promise: sendEmail({
                    to: usuarioTutor.correo,
                    subject: titulo,
                    html: sispracCambioSolicitudVisitaTemplate({
                        tipo,
                        nombreDestinatario: obtenerNombre(usuarioTutor),
                        nombreTutorDocente,
                        nombresPracticantes,
                        fechas,
                        motivo
                    })
                })
            });

        } else {
            console.warn(
                `[cambioSolicitudVisita:${tipo}] El usuario ${usuarioTutor.id} no tiene correo registrado.`
            );
        }

        return tareasTutor;
    });

    const resultados = await Promise.allSettled(
        tareas.map((t) => t.promise)
    );

    resultados.forEach((resultado, index) => {
        if (resultado.status === "rejected") {
            console.error(
                `Error en ${tareas[index].tipo}:`,
                resultado.reason
            );
        }
    });
};