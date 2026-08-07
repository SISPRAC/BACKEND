import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const editarConvenio = async (
    convenioRepository,
    id,
    data
) => {

    const convenio =
        await convenioRepository.findById(id);

    if(!convenio){
        throw new BadRequestError(
            "Convenio no encontrado"
        );
    }

    await convenioRepository.update(id, {
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        archivo_id: data.archivo_id
    });

    return await convenioRepository.findById(id);
};