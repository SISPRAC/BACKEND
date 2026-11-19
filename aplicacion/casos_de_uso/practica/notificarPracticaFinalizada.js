// aplicacion/casos_de_uso/practica/notificarPracticaFinalizada.js
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracPracticaFinalizadaTemplate } from "../../../infraestructura/external/email/templates/sispracPracticaFinalizadaTemplate.js";
import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (u) => `${u?.nombres ?? ""} ${u?.apellidos ?? ""}`.trim();

export const notificarPracticaFinalizada = async ({
    practica,
    empresas,            // [{ nombre, usuario: { id, correo, nombres, apellidos } }]
    userRepository,
    notificacionRepository
}) => {
    const directores = await userRepository.findUsuariosPorRol("Director de programa");

    const destinatarios = [
        ...empresas.map((e) => ({
            usuario: e.usuario,
            titulo: "Práctica finalizada",
            descripcion: `La práctica del periodo ${practica.Periodo.nombre} ha finalizado y las vacantes de "${e.nombre}" fueron cerradas.`,
            asunto: "Práctica finalizada en SISPRAC",
            rol: "EMPRESA",
        })),
        ...directores.map((d) => ({
            usuario: d,
            titulo: "Práctica finalizada",
            descripcion: `La práctica del periodo ${practica.Periodo.nombre} pasó a estado FINALIZADA.`,
            asunto: "Práctica finalizada en SISPRAC",
            rol: "DIRECTOR",
        })),
    ];

    const internas = await Promise.allSettled(
        destinatarios
            .filter(({ usuario }) => usuario?.id)
            .map(({ usuario, titulo, descripcion }) =>
                crearNotificacion({ notificacionRepository }, {
                    usuario_id: usuario.id, titulo, descripcion
                })
            )
    );
    internas.forEach((r) => r.status === "rejected" &&
        console.error("Error notificación interna práctica finalizada:", r.reason));

    const correos = await Promise.allSettled(
        destinatarios
            .filter(({ usuario }) => usuario?.correo)
            .map(({ usuario, asunto, rol, nombreEmpresa }) =>
                sendEmail({
                    to: usuario.correo,
                    subject: asunto,
                    html: sispracPracticaFinalizadaTemplate({
                        nombreDestinatario: obtenerNombre(usuario),
                        rol,
                        periodo: practica.Periodo.nombre,
                        fechaInicio: practica.fecha_inicio,
                        fechaFin: practica.fecha_fin,
                        nombreEmpresa,
                    }),
                })
            )
    );
    correos.forEach((r) => r.status === "rejected" &&
        console.error("Error correo práctica finalizada:", r.reason));
};