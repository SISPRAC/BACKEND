import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRespuestaSolicitudVisitaTemplate } from "../../../infraestructura/external/email/templates/sispracRespuestaSolicitudVisitaTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

// YYYY-MM-DD -> DD/MM/YYYY
const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [y, m, d] = String(fecha).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
};

// HH:mm[:ss] -> h:mm a. m. / p. m.
const formatearHora12 = (hora) => {
    if (!hora) return "";
    const [h, m] = String(hora).split(":");
    const horas = Number(h);
    const sufijo = horas >= 12 ? "p. m." : "a. m.";
    return `${horas % 12 || 12}:${m} ${sufijo}`;
};

export const notificarRespuestaSolicitudVisita = async ({
    aceptada,
    usuarioTutorDocente,
    nombreTutorEmpresa,
    nombreEmpresa = "la empresa",
    nombresPracticantes = [],
    fechaVisita = null,     // solo aceptada
    horaVisita = null,      // solo aceptada
    motivo = null,          // solo rechazada
    notificacionRepository
}) => {

    if (!usuarioTutorDocente?.id) {
        console.warn(
            "[respuestaSolicitudVisita] No se encontró el tutor docente."
        );
        return;
    }

    const fechaFormateada = formatearFecha(fechaVisita);
    const horaFormateada = formatearHora12(horaVisita);

    const esPlural = nombresPracticantes.length > 1;

    const destino = nombresPracticantes.length === 0
        ? ""
        : esPlural
            ? ` para los practicantes: ${nombresPracticantes.join(", ")}`
            : ` para el practicante: ${nombresPracticantes[0]}`;

    const titulo = aceptada
        ? "Visita programada"
        : "Solicitud de visita rechazada";

    const descripcion = aceptada
        ? `El tutor empresarial ${nombreTutorEmpresa} de la empresa ${nombreEmpresa} aceptó la solicitud de visita${destino}. La visita quedó programada para el ${fechaFormateada} a las ${horaFormateada}.`
        : `El tutor empresarial ${nombreTutorEmpresa} de la empresa ${nombreEmpresa} rechazó la solicitud de visita${destino}. Motivo: ${motivo}`;

    const tareas = [
        {
            tipo: "notificación interna",
            promise: crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuarioTutorDocente.id,
                    titulo,
                    descripcion
                }
            )
        }
    ];

    if (usuarioTutorDocente.correo) {

        tareas.push({
            tipo: "correo electrónico",
            promise: sendEmail({
                to: usuarioTutorDocente.correo,
                subject: `${titulo} - ${nombreEmpresa}`,
                html: sispracRespuestaSolicitudVisitaTemplate({
                    aceptada,
                    nombreDestinatario: obtenerNombre(usuarioTutorDocente),
                    nombreTutorEmpresa,
                    nombreEmpresa,
                    nombresPracticantes,
                    fechaVisita: fechaFormateada,
                    horaVisita: horaFormateada,
                    motivo
                })
            })
        });

    } else {
        console.warn(
            `[respuestaSolicitudVisita] El usuario ${usuarioTutorDocente.id} no tiene correo registrado.`
        );
    }

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