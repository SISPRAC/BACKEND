// aplicacion/casos_de_uso/convenio/notificarConvenioVencido.js
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracConvenioVencidoTemplate } from "../../../infraestructura/external/email/templates/sispracConvenioVencidoTemplate.js";
import { crearNotificacion } from "../notificacion/crearNotificacion.js";

const obtenerNombre = (u) => `${u?.nombres ?? ""} ${u?.apellidos ?? ""}`.trim();

export const notificarConvenioVencido = async ({
    convenio,
    empresa,
    userRepository,
    notificacionRepository
}) => {

    const directores = await userRepository.findUsuariosPorRol("Director de programa");

    console.log("Directores encontrados:", directores.length);

    const asunto = "Convenio vencido en SISPRAC";
    const titulo = "Convenio vencido";

    const destinatarios = [
        {
            usuario: empresa?.Usuario,
            rol: "EMPRESA",
            descripcion: `Tu convenio con la universidad venció el ${convenio.fecha_fin}. Para continuar con el proceso de prácticas, carga un nuevo convenio en SISPRAC.`
        },
        ...directores.map((d) => ({
            usuario: d,
            rol: "DIRECTOR",
            descripcion: `El convenio de la empresa "${empresa?.nombre}" venció el ${convenio.fecha_fin} y pasó a estado VENCIDO.`
        }))
    ];

    console.log("Destinatarios:", destinatarios.map(d => ({
        rol: d.rol,
        id: d.usuario?.id,
        correo: d.usuario?.correo
    })));

    // Notificaciones internas
    const internas = await Promise.allSettled(
        destinatarios
            .filter(({ usuario }) => usuario?.id)
            .map(({ usuario, descripcion }) =>
                crearNotificacion({ notificacionRepository }, {
                    usuario_id: usuario.id,
                    titulo,
                    descripcion
                })
            )
    );
    internas.forEach((r) => r.status === "rejected" &&
        console.error("Error notificación interna convenio vencido:", r.reason));

    // Correos
    const correos = await Promise.allSettled(
        destinatarios
            .filter(({ usuario }) => usuario?.correo)
            .map(({ usuario, rol }) =>
                sendEmail({
                    to: usuario.correo,
                    subject: asunto,
                    html: sispracConvenioVencidoTemplate({
                        nombreDestinatario: obtenerNombre(usuario),
                        rol,
                        nombreEmpresa: empresa?.nombre,
                        fechaInicio: convenio.fecha_inicio,
                        fechaFin: convenio.fecha_fin
                    })
                })
            )
    );
    correos.forEach((r) => r.status === "rejected" &&
        console.error("Error correo convenio vencido:", r.reason));
};