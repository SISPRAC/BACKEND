import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const cambiarEstadoUsuario = async ({
    userRepository
}, usuarioId, estado) => {

    if (!usuarioId) {
        throw new BadRequestError(
            "El ID del usuario es obligatorio"
        );
    }

    if (!estado) {
        throw new BadRequestError(
            "El estado del usuario es obligatorio"
        );
    }

    const estadosPermitidos = [
        "ACTIVO",
        "INACTIVO"
    ];

    if (!estadosPermitidos.includes(estado)) {
        throw new BadRequestError(
            "El estado debe ser ACTIVO o INACTIVO"
        );
    }

    const usuario = await userRepository.findById(usuarioId);

    if (!usuario) {
        throw new BadRequestError(
            "Usuario no encontrado"
        );
    }

    if (usuario.estado === estado) {
        throw new BadRequestError(
            `El usuario ya se encuentra ${estado}`
        );
    }

    return await userRepository.update(
        usuarioId,
        { estado }
    );
};