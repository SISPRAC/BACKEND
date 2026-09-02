import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const getVacantesByEmpresa = async (
    {
        empresaRepository,
        vacanteRepository
    },
    usuarioId
) => {

    const empresa =
        await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró la empresa asociada al usuario"
        );
    }

    return await vacanteRepository.findByEmpresa(
        empresa.id
    );
};