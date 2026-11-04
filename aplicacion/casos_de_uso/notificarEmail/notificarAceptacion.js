import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracAceptacionTemplate } from "../../../infraestructura/external/email/templates/sispracAceptacionTemplate.js";

const obtenerNombre = (usuario) => {
    return `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();
};

export const notificarAceptacion = async ({
    postulacion,
    userRepository
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
        fechaInicio: apertura.practica.fecha_inicio
    };

    const destinatarios = [
        {
            usuario: usuarioCandidato,
            tipo: "candidato",
            asunto: "¡Tu postulación ha sido aceptada!"
        },
        {
            usuario: empresa.Usuario,
            tipo: "empresa",
            asunto: "Notificación de practicante seleccionado"
        },
        {
            usuario: tutor,
            tipo: "tutor",
            asunto: "Notificación de nuevo practicante asignado"
        },
        ...directores.map((director) => ({
            usuario: director,
            tipo: "director",
            asunto: "Notificación de postulación aceptada"
        }))
    ];

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

    const resultados = await Promise.allSettled(envios);

    resultados.forEach((resultado) => {
        if (resultado.status === "rejected") {
            console.error(
                "Error enviando notificación de aceptación:",
                resultado.reason
            );
        }
    });
};