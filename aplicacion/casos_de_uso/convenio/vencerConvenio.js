import { cambiarEstadoConvenio } from "./actualizarEstadoConvenio.js";

export const vencerConvenios = async (
    convenioRepository,
    historialConvenioRepository
) => {

    const convenios =
        await convenioRepository.findConveniosParaVencer();

    const ahora = new Date();

    const fechaActual =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "America/Bogota",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).format(ahora);

    for (const convenio of convenios) {

        if (
            convenio.estado === "APROBADO" &&
            convenio.fecha_fin < fechaActual
        ) {

            await cambiarEstadoConvenio(
                convenioRepository,
                historialConvenioRepository,
                convenio.id,
                {
                    estado: "VENCIDO",
                    comentario:
                        "El convenio ha vencido por fecha de finalización",
                    usuario_id: 0
                }
            );
        }
    }

    return {
        mensaje: "Revisión de vencimiento realizada"
    };
};