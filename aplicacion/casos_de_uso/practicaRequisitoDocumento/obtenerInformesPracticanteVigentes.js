import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerInformesPracticanteVigentes = async (
    practicaRequisitoDocumentoRepository,
    userRepository,
    user_id
) => {

    const usuario = await userRepository.findById(user_id);

    if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
    }

    const rolPracticante = usuario.Roles?.find(
        rol => rol.nombre === "Practicante"
    );

    if (!rolPracticante) { 
        throw new NotFoundError(
            "El usuario no tiene el rol de Practicante"
        );
    }

    return await practicaRequisitoDocumentoRepository
        .findInformesPracticanteVigentes(
            rolPracticante.id,
            user_id
        );

};