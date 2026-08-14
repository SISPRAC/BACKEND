import { uploadArchivo } from "../../../infraestructura/external/storageService.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
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

    console.log("Datos recibidos en registrarEmpresa:", data, file);

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
            tipo_documento
        } = data;

        // 1. Validar duplicados
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

            if (!file.mimetype.startsWith("image/")) {
                throw new BadRequestError(
                    "El logo debe ser una imagen"
                );
            }

            const extension =
                file.mimetype.split("/")[1];

            const uploadResult =
                await uploadArchivo(
                    file.buffer,
                    `empresas/${nit}/fotos`,
                    `logo.${extension}`,
                    file.mimetype
                );

            logoUrl = uploadResult.url;
            logoPublicId = uploadResult.public_id;
        }

        // 3. Encriptar contraseña
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // 4. Crear usuario
        const user =
            await userRepository.create({
                cedula,
                nombres,
                apellidos,
                correo,
                telefono,
                password: hashedPassword,
                tipo_documento
            }, transaction);

        // 5. Rol
        const rol =
            await rolRepository.findByNombre("Empresa");

        if (!rol) {
            throw new Error(
                "No se encontró el rol Empresa"
            );
        }

        await user.addRole(
            rol,
            { transaction }
        );

        // 6. Crear empresa
        const empresa =
            await empresaRepository.create({
                nit,
                nombre,
                direccion,
                logo: logoUrl,
                logo_public_id: logoPublicId,
                usuario_id: user.id
            }, transaction);

        // 7. Confirmar
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