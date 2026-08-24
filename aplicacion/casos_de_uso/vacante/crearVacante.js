import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const crearVacante = async (
    {
        empresaRepository,
        convenioRepository,
        vacanteRepository
    },
    usuarioId,
    data
) => {

    const empresa =
        await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró la empresa asociada al usuario"
        );
    }

    const convenio =
        await convenioRepository.findAprobadoByEmpresaId(
            empresa.id
        );

    if (!convenio) {
        throw new BadRequestError(
            "La empresa no tiene un convenio aprobado para crear la vacante"
        );
    }

    if (!data.nombre || !data.descripcion) {
        throw new BadRequestError(
            "El nombre y la descripción de la vacante son obligatorios"
        );
    }

    const vacante =
        await vacanteRepository.create({
            convenio_id: convenio.id,
            nombre: data.nombre,
            descripcion: data.descripcion
        });

    return vacante;
};