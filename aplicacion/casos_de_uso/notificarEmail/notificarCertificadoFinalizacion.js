import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracCertificadoFinalizacionTemplate } from "../../../infraestructura/external/email/templates/sispracCertificadoFinalizacionTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

const formatearFecha = (fecha) => {
    return new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(fecha);
};

export const notificarCertificadoFinalizacion = async ({
    empresa,
    practicante,
    tutorDocente,
    fechaSubida,
    userRepository,
    notificacionRepository
}) => {

    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const nombrePracticante = obtenerNombre(practicante);
    const fechaFormateada = formatearFecha(fechaSubida);

    const asunto = "Certificado de finalización de prácticas cargado";
    const titulo = "Certificado de finalización cargado";

    // ==========================================
    // DESTINATARIOS (sin duplicados por id)
    // ==========================================

    const destinatariosBase = [
        ...directores.map((usuario) => ({ usuario, rol: "DIRECTOR" })),
        ...(tutorDocente ? [{ usuario: tutorDocente, rol: "TUTOR_DOCENTE" }] : []),
        ...(practicante ? [{ usuario: practicante, rol: "PRACTICANTE" }] : [])
    ];

    const vistos = new Set();

    const destinatarios = destinatariosBase
        .filter(({ usuario }) => {
            if (!usuario?.id || vistos.has(usuario.id)) return false;
            vistos.add(usuario.id);
            return true;
        })
        .map(({ usuario, rol }) => {

            const descripcion =
                rol === "PRACTICANTE"
                    ? `La empresa "${empresa.nombre}" ha cargado tu certificado de finalización de prácticas en SISPRAC.`
                    : `La empresa "${empresa.nombre}" ha cargado el certificado de finalización de prácticas del practicante ${nombrePracticante}.`;

            return { usuario, rol, asunto, titulo, descripcion };
        });

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const notificaciones = destinatarios.map(
        ({ usuario, titulo, descripcion }) =>
            crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                }
            )
    );

    const resultadosNotificaciones = await Promise.allSettled(notificaciones);

    resultadosNotificaciones.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna del certificado:",
                resultado.reason
            );
        }
    });

    // ==========================================
    // NOTIFICACIONES POR CORREO
    // ==========================================

    const envios = destinatarios
        .filter(({ usuario }) => usuario?.correo)
        .map(({ usuario, rol, asunto }) => {

            const html = sispracCertificadoFinalizacionTemplate({
                nombreDestinatario: obtenerNombre(usuario),
                esPracticante: rol === "PRACTICANTE",
                rol,
                nombreEmpresa: empresa.nombre,
                nombrePracticante,
                fechaSubida: fechaFormateada
            });

            return sendEmail({
                to: usuario.correo,
                subject: asunto,
                html
            });
        });

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error enviando correo del certificado:",
                resultado.reason
            );
        }
    });
};