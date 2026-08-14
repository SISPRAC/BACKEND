import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const cambiarEstadoConvenio = async (
    convenioRepository,
    historialConvenioRepository,
    id,
    data
) => {

    const convenio =
        await convenioRepository.findById(id);

    if (!convenio) {
        throw new BadRequestError(
            "Convenio no encontrado"
        );
    }

    await convenioRepository.update(id, {
        estado: data.estado
    });

    await historialConvenioRepository.create({
        convenio_id: id,
        archivo_id: convenio.archivo_id,
        accion: data.estado,
        fecha: new Date(),
        comentario: data.comentario,
        usuario_id: data.usuario_id
    });

    return await convenioRepository.findById(id);
};