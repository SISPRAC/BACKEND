import { cambiarEstadoConvenio } from "./actualizarEstadoConvenio.js";
import { notificarConvenioVencido } from "./notificarDirectorConvenio.js";

export const vencerConvenios = async (
    convenioRepository,
    historialConvenioRepository,
    empresaRepository,
    notificacionRepository,
    userRepository
) => {

    const convenios = await convenioRepository.findConveniosParaVencer();

    const fechaActual = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());

    let vencidos = 0;

    for (const convenio of convenios) {

        if (convenio.estado !== "APROBADO" || convenio.fecha_fin >= fechaActual) {
            continue;
        }

        try {
            await cambiarEstadoConvenio(
                convenioRepository,
                historialConvenioRepository,
                empresaRepository,
                notificacionRepository,
                convenio.id,
                {
                    estado: "VENCIDO",
                    comentario: "El convenio ha vencido por fecha de finalización",
                    usuario_id: 0
                }
            );
            vencidos++;
        } catch (error) {
            console.error(`Error venciendo convenio ${convenio.id}:`, error);
            continue;
        }

        // Notificación DESPUÉS del cambio de estado
        try {
            await notificarConvenioVencido({
                convenio,
                empresa: convenio.Empresa,
                userRepository,
                notificacionRepository
            });
        } catch (error) {
            console.error(`Error notificando convenio ${convenio.id}:`, error);
        }
    }

    return { revisados: convenios.length, vencidos };
};