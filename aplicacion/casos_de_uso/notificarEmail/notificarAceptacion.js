
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracAceptacionTemplate } from "../../../infraestructura/external/email/templates/sispracAceptacionTemplate.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarAceptacion = async ({
    postulacion,
    userRepository,
    notificacionRepository
}) => {

    const apertura = postulacion.AperturaVacante;
    const candidato = postulacion.Candidato;
    const usuarioCandidato = candidato.Usuario;

    const vacante = apertura.Vacante;
    const empresa = vacante.Convenio.Empresa;
    const tutor = apertura.TutorEmpresa.Usuario;

    const directores = await userRepository.findUsuariosPorRol(
        "Director de programa"
    );

    const datosComunes = {
        nombrePracticante: obtenerNombre(usuarioCandidato),
        codigo: candidato.codigo,
        nombreVacante: vacante.nombre,
        nombreEmpresa: empresa.nombre,

        nombreTutor: obtenerNombre(tutor),
        correoTutor: tutor?.correo ?? "No disponible",
        telefonoTutor: tutor?.telefono ?? "No disponible",

        fechaInicio: apertura.practica.fecha_inicio
    };

    // ==========================================
    // DESTINATARIOS
    // ==========================================

    const destinatarios = [
        {
            usuario: usuarioCandidato,
            tipo: "candidato",
            asunto: "¡Tu práctica profesional ha sido confirmada!",
            titulo: "¡Tu práctica profesional ha sido confirmada!",
            descripcion: `Te informamos que realizarás tus prácticas profesionales en ${empresa.nombre}, en la vacante "${vacante.nombre}". ¡Te deseamos muchos éxitos!`
        },
        {
            usuario: empresa.Usuario,
            tipo: "empresa",
            asunto: "Notificación de practicante seleccionado",
            titulo: "Nuevo practicante asignado",
            descripcion: `Se ha confirmado la asignación de ${obtenerNombre(usuarioCandidato)} como practicante en tu empresa, para la vacante "${vacante.nombre}".`
        },
        {
            usuario: tutor,
            tipo: "tutor",
            asunto: "Notificación de nuevo practicante asignado",
            titulo: "Practicante asignado a tu vacante",
            descripcion: `Se ha confirmado la asignación de ${obtenerNombre(usuarioCandidato)} como practicante en la vacante "${vacante.nombre}", de la empresa "${empresa.nombre}".`
        },
        ...directores.map((director) => ({
            usuario: director,
            tipo: "director",
            asunto: "Notificación de postulación aceptada",
            titulo: "Postulación aceptada",
            descripcion: `Se ha confirmado la aceptación de ${obtenerNombre(usuarioCandidato)} para realizar sus prácticas profesionales en "${empresa.nombre}", en la vacante "${vacante.nombre}".`
        }))
    ];

    // ==========================================
    // NOTIFICACIONES INTERNAS
    // ==========================================

    const notificaciones = destinatarios
        .filter(({ usuario }) => usuario?.id)
        .map(({ usuario, titulo, descripcion }) => {

            return crearNotificacion(
                { notificacionRepository },
                {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                }
            );
        });

    const resultadosNotificaciones = await Promise.allSettled(
        notificaciones
    );

    resultadosNotificaciones.forEach((resultado) => {

        if (resultado.status === "rejected") {
            console.error(
                "Error creando notificación interna de aceptación:",
                resultado.reason
            );
        }

    });

    // ==========================================
    // NOTIFICACIONES POR CORREO
    // ==========================================

    const envios = destinatarios
        .filter(({ usuario }) => usuario?.correo)
        .map(({ usuario, tipo, asunto }) => {

            const html = sispracAceptacionTemplate({
                ...datosComunes,
                nombreDestinatario: obtenerNombre(usuario),
                destinatarioTipo: tipo
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
                "Error enviando notificación de aceptación:",
                resultado.reason
            );
        }

    });

};
