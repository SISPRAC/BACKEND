import { sequelize } from "../../../infraestructura/database/dbConnection.js";
import { uploadArchivo } from "../../../infraestructura/external/storageService.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

export const actualizarEmpresa = async (
    empresaId,
    userRepository,
    empresaRepository,
    data,
    file
) => {

    const transaction = await sequelize.transaction();

    try {

        // 1. Buscar empresa
        const empresa = await empresaRepository.findById(
            empresaId
        );

        if (!empresa) {
            throw new BadRequestError(
                "Empresa no encontrada"
            );
        }

        // 2. Separar datos de Usuario y Empresa
        const {
            nombres,
            apellidos,
            correo,
            telefono,
            cedula,
            tipo_documento,

            nit,
            nombre,
            direccion
        } = data;

        // 3. Validar correo
        if (correo !== undefined) {

            const usuarioCorreo =
                await userRepository.findByCorreoEmpresa(correo);

            if (
                usuarioCorreo &&
                usuarioCorreo.id !== empresa.usuario_id
            ) {
                throw new ConflictError(
                    "El correo ya está registrado"
                );
            }
        }

        // 4. Validar cédula
        if (cedula !== undefined) {

            const usuarioCedula =
                await userRepository.findByCedula(cedula);

            if (
                usuarioCedula &&
                usuarioCedula.id !== empresa.usuario_id
            ) {
                throw new ConflictError(
                    "La cédula ya está registrada"
                );
            }
        }

        // 5. Validar NIT
        if (nit !== undefined) {

            const empresaNit =
                await empresaRepository.findByNit(nit);

            if (
                empresaNit &&
                empresaNit.id !== Number(empresaId)
            ) {
                throw new ConflictError(
                    "El NIT ya está registrado"
                );
            }
        }

        // 6. Datos de Usuario
        const datosUsuario = {};

        if (nombres !== undefined)
            datosUsuario.nombres = nombres;

        if (apellidos !== undefined)
            datosUsuario.apellidos = apellidos;

        if (correo !== undefined)
            datosUsuario.correo = correo;

        if (telefono !== undefined)
            datosUsuario.telefono = telefono;

        if (cedula !== undefined)
            datosUsuario.cedula = cedula;

        if (tipo_documento !== undefined)
            datosUsuario.tipo_documento = tipo_documento;

        // 7. Datos de Empresa
        const datosEmpresa = {};

        if (nit !== undefined)
            datosEmpresa.nit = nit;

        if (nombre !== undefined)
            datosEmpresa.nombre = nombre;

        if (direccion !== undefined)
            datosEmpresa.direccion = direccion;

        // 8. Actualizar logo
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
                    `empresas/${nit || empresa.nit}/fotos`,
                    `logo.${extension}`,
                    file.mimetype
                );

            datosEmpresa.logo = uploadResult.url;

            datosEmpresa.logo_public_id =
                uploadResult.public_id;
        }

        // 9. Actualizar Usuario
        if (Object.keys(datosUsuario).length > 0) {

            const usuarioActualizado =
                await userRepository.update(
                    empresa.usuario_id,
                    datosUsuario,
                    transaction
                );

            if (!usuarioActualizado) {
                throw new BadRequestError(
                    "No se pudo actualizar el usuario de la empresa"
                );
            }
        }

        // 10. Actualizar Empresa
        if (Object.keys(datosEmpresa).length > 0) {

            const empresaActualizada =
                await empresaRepository.update(
                    empresaId,
                    datosEmpresa,
                    transaction
                );

            if (!empresaActualizada) {
                throw new BadRequestError(
                    "No se pudo actualizar la empresa"
                );
            }
        }

        // 11. Confirmar transacción
        await transaction.commit();

        // 12. Obtener información actualizada
        const usuarioActualizado =
            await userRepository.findById(
                empresa.usuario_id
            );

        const empresaActualizada =
            await empresaRepository.findById(
                empresaId
            );

        return {
            user: usuarioActualizado,
            empresa: empresaActualizada
        };

    } catch (error) {

        await transaction.rollback();
        throw error;
    }
};