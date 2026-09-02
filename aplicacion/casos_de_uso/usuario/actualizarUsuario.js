import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const actualizarUsuario = async ({
    userRepository
}, usuarioId, datos) => {

    if (!usuarioId) {
        throw new BadRequestError("El ID del usuario es obligatorio");
    }

    if (!datos || Object.keys(datos).length === 0) {
        throw new BadRequestError(
            "No se enviaron datos para actualizar"
        );
    }

    const usuario = await userRepository.findById(usuarioId);

    if (!usuario) {
        throw new BadRequestError("Usuario no encontrado");
    }

    // Solo permitimos modificar estos campos
    const datosPermitidos = {};

    const camposPermitidos = [
        "nombres",
        "apellidos",
        "correo",
        "tipo_documento",
        "cedula",
        "telefono"
    ];

    for (const campo of camposPermitidos) {
        if (datos[campo] !== undefined) {
            datosPermitidos[campo] = datos[campo];
        }
    }

    if (Object.keys(datosPermitidos).length === 0) {
        throw new BadRequestError(
            "No hay campos válidos para actualizar"
        );
    }

    // Validar correo si se está modificando
    if (datosPermitidos.correo) {

        const usuarioCorreo =
            await userRepository.findByCorreo(
                datosPermitidos.correo
            );

        if (
            usuarioCorreo &&
            usuarioCorreo.id !== Number(usuarioId)
        ) {
            throw new ConflictError(
                "El correo ya está registrado"
            );
        }
    }

    // Validar cédula si se está modificando
    if (datosPermitidos.cedula) {

        const usuarioCedula =
            await userRepository.findByCedula(
                datosPermitidos.cedula
            );

        if (
            usuarioCedula &&
            usuarioCedula.id !== Number(usuarioId)
        ) {
            throw new ConflictError(
                "La cédula ya está registrada"
            );
        }
    }

    return await userRepository.update(
        usuarioId,
        datosPermitidos
    );
};