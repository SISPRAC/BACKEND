import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sendEmail } from "../../../infraestructura/external/email/mailService.js";
import { sispracInvitationTemplate } from "../../../infraestructura/external/email/templates/sispracInvitationTemplate.js";
import { tokenService } from "../../../infraestructura/tokenService.js";

// Cuántos correos se envían al mismo tiempo. Suficiente para ir ~5x más
// rápido que uno por uno sin pasarse de los límites de Brevo.
const CONCURRENCIA = 5;

// Máximo por petición (el frontend manda lotes más pequeños)
const MAX_POR_LOTE = 100;

const enviarUno = async ({ correo, codigo, nombre }, grupo_id) => {
    const token = tokenService.generateInvitationCandidatoToken(
        correo,
        codigo,
        grupo_id
    );

    const html = sispracInvitationTemplate({
        codigo,
        nombre,
        linkInscripcion: `${process.env.FRONTEND_URL}/registrarCandidato?token=${token}`
    });

    await sendEmail({
        to: correo,
        subject: "Invitación para registrarse en SISPRAC",
        html
    });
};

export const invitarCandidatosMasivo = async (
    grupoRepository,
    { candidatos, grupo_id }
) => {

    if (!Array.isArray(candidatos) || candidatos.length === 0) {
        throw new BadRequestError("Debe enviar la lista de candidatos");
    }

    if (candidatos.length > MAX_POR_LOTE) {
        throw new BadRequestError(
            `Máximo ${MAX_POR_LOTE} candidatos por solicitud`
        );
    }

    // El grupo se valida UNA vez (antes se validaba por cada candidato)
    if (grupo_id) {
        const grupo = await grupoRepository.findById(grupo_id);
        if (!grupo) {
            throw new BadRequestError("El grupo no existe");
        }
    }

    const enviados = [];
    const fallidos = [];

    // Pool simple: CONCURRENCIA "trabajadores" toman candidatos de la cola
    let siguiente = 0;

    const trabajador = async () => {
        while (siguiente < candidatos.length) {
            const c = candidatos[siguiente++];

            if (!c?.correo || !c?.codigo) {
                fallidos.push({
                    correo: c?.correo ?? null,
                    codigo: c?.codigo ?? null,
                    motivo: !c?.correo
                        ? "El correo es obligatorio"
                        : "El código del candidato es obligatorio"
                });
                continue;
            }

            try {
                await enviarUno(c, grupo_id);
                enviados.push({ correo: c.correo, codigo: c.codigo });
            } catch (error) {
                console.error(`Error invitando a ${c.correo}:`, error.message);
                fallidos.push({
                    correo: c.correo,
                    codigo: c.codigo,
                    motivo: "No se pudo enviar el correo"
                });
            }
        }
    };

    await Promise.all(
        Array.from(
            { length: Math.min(CONCURRENCIA, candidatos.length) },
            trabajador
        )
    );

    return {
        message: `${enviados.length} invitación(es) enviada(s)`,
        enviados,
        fallidos
    };
};
