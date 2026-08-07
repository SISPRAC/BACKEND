import bcrypt from "bcryptjs";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const createStaffUser = async (repos, data) => {
    const { userRepository, rolRepository} = repos;

    const { rol, ...userData } = data;

    // 1. validar existencia
    const exist = await userRepository.findBycorreo(userData.correo) || await userRepository.findByCedula(userData.cedula);
    if (exist) {
        throw new ConflictError("USER_ALREADY_EXISTS");
    }

    // 2. hash contraseña
    const hashedcontraseña = await bcrypt.hash(userData.contraseña, 10);

    // 3. crear usuario
    const user = await userRepository.create({
        ...userData,
        contraseña: hashedcontraseña
    });

    // 4. asignar roles (puede tener varios)
        const role = await rolRepository.findByName(rol);

        if (!role) {
            throw new BadRequestError(`ROLE_NOT_FOUND: ${role}`);
        }

        await user.addRole(role);
   

    return { user, "assignedRole": rol };
};