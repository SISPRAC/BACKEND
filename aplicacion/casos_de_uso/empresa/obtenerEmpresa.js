import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerEmpresa = async (
    empresaRepository,
    usuarioId
) => {

    if (!usuarioId) {
        throw new BadRequestError(
            "El usuario no está identificado"
        );
    }

    const empresa =
        await empresaRepository.findByUserId(
            usuarioId
        );

    if (!empresa) {
        throw new BadRequestError(
            "No se encontró una empresa asociada al usuario"
        );
    }

    return empresa;
};