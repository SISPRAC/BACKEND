import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import { sendEmail } from "../../../infraestructura/external/email/mailService.js";

import { sispracRetiroPracticanteTemplate } from "../../../infraestructura/external/email/templates/sispracRetiroPracticanteTemplate.js";

const obtenerNombre = (usuario) =>
    `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

// YYYY-MM-DD -> DD/MM/YYYY
const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const [y, m, d] = String(fecha).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
};

export const notificarRetiroPracticante = async ({
    practicaPracticanteId,
    usuarioRetiroId,
    esAutoRetiro,
    motivo,
    fechaRetiro,
    practicaPracticanteRepository,
    postulacionRepository,
    userRepository,
    notificacionRepository
}) => {

    // ==========================================
    // PRACTICANTE
    // ==========================================

    const practicaPracticante =
        await practicaPracticanteRepository
            .findByIdWithPracticaAndCandidato(practicaPracticanteId);

    const candidato = practicaPracticante?.practicante?.candidato;
    const usuarioPracticante = candidato?.Usuario ?? null;

    if (!candidato || !usuarioPracticante) {
        console.warn("[retiroPracticante] No se encontró el practicante.");
        return;
    }

    const nombrePracticante =
        obtenerNombre(usuarioPracticante) || "el practicante";

    // ==========================================
    // EMPRESA Y TUTOR EMPRESARIAL
    // ==========================================

    const postulacion =
        await postulacionRepository.findAceptadaByCandidatoYPractica(
            candidato.id,
            practicaPracticante.practica_id
        );

    const tutorEmpresarial = postulacion?.AperturaVacante?.TutorEmpresa;
    const usuarioTutorEmpresarial = tutorEmpresarial?.Usuario ?? null;
    const empresa = tutorEmpresarial?.Empresa ?? null;
    const nombreEmpresa = empresa?.nombre ?? "la empresa";

    // ==========================================
    // QUIÉN RETIRÓ
    // ==========================================

    let retiradoPor;

    if (esAutoRetiro) {
        retiradoPor = "PRACTICANTE";
    } else if (
        Number(usuarioRetiroId) === Number(usuarioTutorEmpresarial?.id) ||
        Number(usuarioRetiroId) === Number(empresa?.usuario_id)
    ) {
        retiradoPor = "EMPRESA";
    } else {
        retiradoPor = "DIRECTOR";
    }

    // ==========================================
    // DESTINATARIOS (sin duplicados por id)
    // ==========================================

    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const candidatos = [];

    if (retiradoPor !== "PRACTICANTE") {
        candidatos.push({ usuario: usuarioPracticante, rol: "PRACTICANTE" });
    }

    if (retiradoPor !== "EMPRESA") {
        directores.forEach((usuario) =>
            candidatos.push({ usuario, rol: "DIRECTOR" })
        );
    }

    if (retiradoPor !== "EMPRESA" && usuarioTutorEmpresarial) {
        candidatos.push({
            usuario: usuarioTutorEmpresarial,
            rol: "TUTOR_EMPRESARIAL"
        });
    }

    const vistos = new Set();

    const destinatarios = candidatos.filter(({ usuario }) => {
        if (!usuario?.id || vistos.has(usuario.id)) return false;
        vistos.add(usuario.id);
        return true;
    });

    if (destinatarios.length === 0) {
        console.warn("[retiroPracticante] No hay destinatarios.");
        return;
    }

    // ==========================================
    // TEXTOS
    // ==========================================

    const titulo = "Retiro de practicante";
    const fecha = formatearFecha(fechaRetiro);

    const hecho = {
        PRACTICANTE: `el practicante ${nombrePracticante} se ha retirado de su práctica en la empresa ${nombreEmpresa}`,
        EMPRESA: `la empresa ${nombreEmpresa} ha retirado al practicante ${nombrePracticante} de su práctica`,
        DIRECTOR: `el director del programa ha retirado al practicante ${nombrePracticante} de su práctica en la empresa ${nombreEmpresa}`
    }[retiradoPor];

    const construirDescripcion = (rol) => {
        const lamento = rol === "PRACTICANTE"
            ? "Lamentamos informarte que"
            : "Lamentamos informar que";

        return `${lamento} ${hecho}. Motivo: ${motivo}`;
    };

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const resultadosNotificaciones = await Promise.allSettled(
        destinatarios.map(({ usuario, rol }) =>
            crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion: construirDescripcion(rol)
                }
            )
        )
    );

    resultadosNotificaciones.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna del retiro:",
                resultado.reason
            );
        }
    });

    // ==========================================
    // CORREOS
    // ==========================================

    const envios = destinatarios
        .filter(({ usuario }) => usuario?.correo)
        .map(({ usuario, rol }) =>
            sendEmail({
                to: usuario.correo,
                subject: `${titulo} - ${nombrePracticante}`,
                html: sispracRetiroPracticanteTemplate({
                    nombreDestinatario: obtenerNombre(usuario),
                    esPracticante: rol === "PRACTICANTE",
                    retiradoPor,
                    nombrePracticante,
                    nombreEmpresa,
                    motivo,
                    fecha
                })
            })
        );

    const resultadosCorreos = await Promise.allSettled(envios);

    resultadosCorreos.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error enviando correo del retiro:",
                resultado.reason
            );
        }
    });
};