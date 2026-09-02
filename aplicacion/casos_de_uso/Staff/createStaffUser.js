import bcrypt from "bcryptjs";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const createStaffUser = async (
    sequelize,
    repos,
    data
) => {

    const {
        userRepository,
        rolRepository,
        TutorDocenteRepository,
        tutorEmpresaRepository
    } = repos;

    const transaction = await sequelize.transaction();

    try {

        const {
            rol,
            codigo,
            cargo,
            empresa_id,
            ...userData
        } = data;

        // 1. Validar datos según el rol

        if (!rol) {
            throw new BadRequestError(
                "El rol es obligatorio"
            );
        }

        if (rol === "Tutor Docente" && !codigo) {
            throw new BadRequestError(
                "El código del tutor docente es obligatorio"
            );
        }

        if (rol === "Tutor Empresarial") {

            if (!cargo) {
                throw new BadRequestError(
                    "El cargo del tutor empresarial es obligatorio"
                );
            }

            if (!empresa_id) {
                throw new BadRequestError(
                    "La empresa es obligatoria"
                );
            }
        }

        // 2. Validar existencia del usuario

        const exist =
            await userRepository.findBycorreo(
                userData.correo
            ) ||
            await userRepository.findByCedula(
                userData.cedula
            );

        if (exist) {
            throw new ConflictError(
                "Ya existe un usuario con esos datos"
            );
        }

        // 3. Hash de contraseña

        const hashedPassword =
            await bcrypt.hash(
                userData.password,
                10
            );

        // 4. Crear usuario

        const user =
            await userRepository.create(
                {
                    ...userData,
                    password: hashedPassword
                },
                transaction
            );

        // 5. Buscar rol

        const role =
            await rolRepository.findByNombre(rol);

        if (!role) {
            throw new BadRequestError(
                `ROLE_NOT_FOUND: ${rol}`
            );
        }

        // 6. Asignar rol

        await user.addRole(
            role,
            { transaction }
        );

        // 7. Crear perfil específico del tutor

        let tutor = null;

        if (rol === "Tutor Docente") {

            tutor =
                await TutorDocenteRepository.create(
                    {
                        usuario_id: user.id,
                        codigo
                    },
                    transaction
                );
        }

        if (rol === "Tutor Empresarial") {

            tutor =
                await tutorEmpresaRepository.create(
                    {
                        usuario_id: user.id,
                        empresa_id,
                        cargo
                    },
                    transaction
                );
        }

        // 8. Todo salió correctamente

        await transaction.commit();

        return {
            user,
            tutor,
            assignedRole: rol
        };

    } catch (error) {

        // Si algo falla, deshacer TODO
        await transaction.rollback();

        throw error;
    }
};

