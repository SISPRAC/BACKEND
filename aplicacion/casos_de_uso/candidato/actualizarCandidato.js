import bcrypt from "bcryptjs";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

export const updateCandidato = async (
    sequelize,
    userRepository,
    candidatoRepository,
    perfilRepository,
    candidatoPerfilRepository,
    archivoRepository,
    id,
    data,
    file
) => {

    const transaction = await sequelize.transaction();

    try {

        const candidato = await candidatoRepository.findById(id);

        if (!candidato) {
            throw new BadRequestError("CANDIDATO_NOT_FOUND");
        }

        const {
            nombres,
            apellidos,
            correo,
            telefono,
            cedula,
            tipo_documento,
            password,
            codigo,
            grupo_id,
            perfiles
        } = data;

        const user = await userRepository.findById(
            candidato.usuario_id
        );

        if (!user) {
            throw new BadRequestError(
                "USER_NOT_FOUND"
            );
        }

        // Validar correo
        if (
            correo &&
            correo !== user.correo
        ) {

            const correoExist =
                await userRepository.findBycorreo(correo);

            if (
                correoExist &&
                correoExist.id !== user.id
            ) {
                throw new ConflictError(
                    "EMAIL_ALREADY_EXISTS"
                );
            }
        }

        // Validar cédula
        if (
            cedula &&
            cedula !== user.cedula
        ) {

            const cedulaExist =
                await userRepository.findByCedula(cedula);

            if (
                cedulaExist &&
                cedulaExist.id !== user.id
            ) {
                throw new ConflictError(
                    "DOCUMENT_ALREADY_EXISTS"
                );
            }
        }

        // Validar código
        if (
            codigo &&
            codigo !== candidato.codigo
        ) {

            const codigoExist =
                await candidatoRepository.findByCodigo(codigo);

            if (
                codigoExist &&
                codigoExist.id !== candidato.id
            ) {
                throw new ConflictError(
                    "CODE_ALREADY_EXISTS"
                );
            }
        }

        // Datos usuario
        const userData = {};

        if (nombres !== undefined) {
            userData.nombres = nombres;
        }

        if (apellidos !== undefined) {
            userData.apellidos = apellidos;
        }

        if (correo !== undefined) {
            userData.correo = correo;
        }

        if (telefono !== undefined) {
            userData.telefono = telefono;
        }

        if (cedula !== undefined) {
            userData.cedula = cedula;
        }

        if (tipo_documento !== undefined) {
            userData.tipo_documento = tipo_documento;
        }

        if (password) {
            userData.password =
                await bcrypt.hash(password, 10);
        }

        if (Object.keys(userData).length > 0) {

            await userRepository.update(
                user.id,
                userData,
                transaction
            );
        }

        // Datos candidato
        const candidatoData = {};

        if (codigo !== undefined) {
            candidatoData.codigo = codigo;
        }

        if (grupo_id !== undefined) {
            candidatoData.grupo_id = grupo_id;
        }

        if (file) {

            // 1. Obtener el archivo anterior
            let archivoAnterior = null;

            if (candidato.hoja_vida_archivo_id) {

                archivoAnterior =
                    await archivoRepository.findById(
                        candidato.hoja_vida_archivo_id
                    );
            }

            // 2. Código actual del candidato
            const codigoCandidato =
                codigo || candidato.codigo;

            // 3. Subir nuevo archivo a Cloudinary
            const uploadResult = await uploadArchivo(
                file.buffer,
                `candidatos/${codigoCandidato}/documentos`,
                `hoja_vida_${codigoCandidato}`,
                "raw"
            );

            // 4. Crear nuevo registro en Archivos
            const nuevoArchivo =
                await archivoRepository.create(
                    {
                        nombre: file.originalname,
                        url: uploadResult.url
                    },
                    transaction
                );

            // 5. Actualizar referencia del candidato
            candidatoData.hoja_vida_archivo_id =
                nuevoArchivo.id;

            // 6. Eliminar archivo anterior
            if (
                archivoAnterior &&
                archivoAnterior.public_id
            ) {

                await deleteArchivo(
                    archivoAnterior.public_id,
                    "raw"
                );

                await archivoRepository.delete(
                    archivoAnterior.id,
                    transaction
                );
            }
        }

        if (Object.keys(candidatoData).length > 0) {

            await candidatoRepository.update(
                candidato.id,
                candidatoData,
                transaction
            );
        }

        // Actualizar perfiles
        if (perfiles !== undefined) {

            await candidatoPerfilRepository.deleteByCandidatoId(
                candidato.id,
                transaction
            );

            for (const perfil of perfiles) {

                const perfilExist =
                    await perfilRepository.findById(
                        perfil.perfil_id
                    );

                if (!perfilExist) {
                    throw new BadRequestError(
                        `PROFILE_NOT_FOUND: ${perfil.perfil_id}`
                    );
                }

                await candidatoPerfilRepository.create(
                    {
                        candidato_id: candidato.id,
                        perfil_id: perfil.perfil_id,
                        calificacion: perfil.calificacion
                    },
                    transaction
                );
            }
        }

        await transaction.commit();

        return true;

    } catch (error) {

        await transaction.rollback();
        throw error;

    }

};