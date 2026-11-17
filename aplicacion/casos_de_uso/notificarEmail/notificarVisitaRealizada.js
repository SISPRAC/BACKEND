import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracVisitaRealizadaTemplate } from "../../../infraestructura/external/email/templates/sispracVisitaRealizadaTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

// Fecha y hora en Colombia, hora en formato 12 horas
const formatearFechaHora = (fecha) =>
    new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(fecha);

export const notificarVisitaRealizada = async ({
    tutores,                 // [{ usuarioTutor, nombresPracticantes }]
    nombresPracticantes,     // todos (para el director)
    nombreTutorDocente,
    nombreEmpresa,
    fechaRealizada,
    esActualizacion = false,
    userRepository,
    notificacionRepository
}) => {

    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const fechaFormateada = formatearFechaHora(fechaRealizada);

    const titulo = esActualizacion
        ? "Visita de seguimiento actualizada"
        : "Visita de seguimiento realizada";

    const verbo = esActualizacion ? "actualizó" : "registró";

    // ==========================================
    // DESTINATARIOS (sin duplicados por id)
    // ==========================================

    const destinatariosBase = [
        ...tutores.map(({ usuarioTutor, nombresPracticantes: nombres }) => ({
            usuario: usuarioTutor,
            rol: "TUTOR_EMPRESARIAL",
            nombres
        })),
        ...directores.map((usuario) => ({
            usuario,
            rol: "DIRECTOR",
            nombres: nombresPracticantes
        }))
    ];

    const vistos = new Set();

    const destinatarios = destinatariosBase
        .filter(({ usuario }) => {
            if (!usuario?.id || vistos.has(usuario.id)) return false;
            vistos.add(usuario.id);
            return true;
        })
        .map(({ usuario, rol, nombres }) => {

            const destino = nombres.length > 1
                ? `los practicantes: ${nombres.join(", ")}`
                : `el practicante: ${nombres[0] ?? "—"}`;

            const descripcion =
                `El tutor docente ${nombreTutorDocente} ${verbo} la visita de seguimiento ` +
                `a la empresa ${nombreEmpresa} para ${destino}.`;

            return { usuario, rol, nombres, descripcion };
        });

    if (destinatarios.length === 0) {
        console.warn("[visitaRealizada] No hay destinatarios para notificar.");
        return;
    }

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const resultadosNotificaciones = await Promise.allSettled(
        destinatarios.map(({ usuario, descripcion }) =>
            crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                }
            )
        )
    );

    resultadosNotificaciones.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de la visita:",
                resultado.reason
            );
        }
    });

    // ==========================================
    // CORREOS
    // ==========================================

    const envios = destinatarios
        .filter(({ usuario }) => usuario?.correo)
        .map(({ usuario, rol, nombres }) =>
            sendEmail({
                to: usuario.correo,
                subject: `${titulo} - ${nombreEmpresa}`,
                html: sispracVisitaRealizadaTemplate({
                    nombreDestinatario: obtenerNombre(usuario),
                    esDirector: rol === "DIRECTOR",
                    esActualizacion,
                    nombreTutorDocente,
                    nombreEmpresa,
                    nombresPracticantes: nombres,
                    fechaRealizada: fechaFormateada
                })
            })
        );

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error enviando correo de la visita:",
                resultado.reason
            );
        }
    });
};