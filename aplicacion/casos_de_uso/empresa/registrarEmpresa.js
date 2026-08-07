import { uploadArchivo } from "../../../infraestructura/external/storageService.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import bcrypt from "bcryptjs";

export const registerEmpresa = async (
    sequelize,
    userRepository,
    empresaRepository,
    rolRepository,
    archivoRepository,
    data,
    file
) => {

    const transaction = await sequelize.transaction();

    try {

        const {
            nombres,
            apellidos,
            correo,
            password,
            telefono,
            nombre,
            nit,
            direccion,
            cedula,
            tipo_documento,
        } = data;

        // 1. Validar que no exista información duplicada
        const exist =
            await userRepository.findBycorreo(correo) ||
            await empresaRepository.findByNit(nit) ||
            await userRepository.findByCedula(cedula);

        if (exist) {
            throw new ConflictError(
                "Ya existe un usuario con esos datos"
            );
        }

        // 2. Validar y subir logo
        let logoUrl = null;
        let logoPublicId = null;

        if (file) {

            const uploadResult = await uploadArchivo(
                file.buffer,
                `empresas/${nit}/fotos`,
                "logo",
                "image"
            );

            logoUrl = uploadResult.url;
            logoPublicId = uploadResult.public_id;
        }


        // 4. Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Crear usuario
        const user = await userRepository.create({
            cedula,
            nombres,
            apellidos,
            correo,
            telefono,
            password: hashedPassword,
            tipo_documento,

        }, transaction);

        const rol = await rolRepository.findByNombre("Empresa");

        if (!rol) {
            throw new Error("No se encontró el rol Empresa");
        }

        await user.addRole(rol, { transaction });


        // 8. Crear empresa
        const empresa = await empresaRepository.create({
            nit,
            nombre,
            direccion,
            logo: logoUrl,
            logo_public_id: logoPublicId,
            usuario_id: user.id
        }, transaction);

        // 9. Confirmar transacción
        await transaction.commit();

        return {
            user,
            empresa
        };

    } catch (error) {

        await transaction.rollback();
        throw error;

    }
};