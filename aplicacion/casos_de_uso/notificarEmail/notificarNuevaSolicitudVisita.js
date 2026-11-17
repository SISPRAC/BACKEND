import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracNuevaSolicitudVisitaTemplate } from "../../../infraestructura/external/email/templates/sispracNuevaSolicitudVisitaTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

export const notificarNuevaSolicitudVisita = async ({
    tutores,
    nombreTutorDocente,
    fechas,
    notificacionRepository
}) => {

    if (!tutores || tutores.length === 0) {
        console.warn(
            "[nuevaSolicitudVisita] No hay tutores empresariales para notificar."
        );
        return;
    }

    const tareas = tutores.flatMap(({ usuarioTutor, nombresPracticantes }) => {

        const esPlural = nombresPracticantes.length > 1;

        const titulo = "Nueva solicitud de visita";

        const descripcion =
            `El tutor docente ${nombreTutorDocente} ha solicitado una visita para ` +
            (esPlural
                ? `los practicantes: ${nombresPracticantes.join(", ")}. `
                : `el practicante: ${nombresPracticantes[0]}. `) +
            "Por favor, revise la solicitud y seleccione una de las disponibilidades propuestas.";

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
                    html: sispracNuevaSolicitudVisitaTemplate({
                        nombreDestinatario: obtenerNombre(usuarioTutor),
                        nombreTutorDocente,
                        nombresPracticantes,
                        fechas
                    })
                })
            });

        } else {
            console.warn(
                `[nuevaSolicitudVisita] El usuario ${usuarioTutor.id} no tiene correo registrado.`
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