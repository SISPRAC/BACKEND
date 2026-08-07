import { uploadArchivo } from "../../../infraestructura/external/storageService.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import bcrypt from "bcryptjs";

export const registerCandidato = async (
    sequelize,
    userRepository,
    candidatoRepository,
    rolRepository,
    perfilRepository,
    candidatoPerfilRepository,
    archivoRepository,
    data,
    file
) => {

    const transaction = await sequelize.transaction();

    try {

        const {
            correo,
            password,
            telefono,
            codigo,
            cedula,
            nombres,
            apellidos,
            tipo_documento,
            perfiles
        } = data;

        console.log("Datos recibidos:", data);

        let perfilesParseados = perfiles;

        if (typeof perfiles === "string") {
            try {
                perfilesParseados = JSON.parse(perfiles);
            } catch (error) {
                throw new BadRequestError(
                    "El formato de los perfiles no es válido."
                );
            }
        }

        if (!perfilesParseados || perfilesParseados.length === 0) {
            throw new BadRequestError("El perfil es requerido");
        }

        // 1. Validaciones
        const exist =
            await userRepository.findBycorreo(correo) ||
            await userRepository.findByCedula(cedula) ||
            await candidatoRepository.findByCodigo(codigo);

        if (exist) {
            throw new ConflictError("Ya existe un usuario con esos datos");
        }

        // PDF obligatorio
        let archivoHojaVida = null;

        if (file) {

            const uploadResult = await uploadArchivo(
                file.buffer,
                `candidatos/${codigo}/documentos`,
                `hoja_vida_${codigo}`,
                "raw"
            );

            archivoHojaVida = await archivoRepository.create({
                nombre: file.originalname,
                url: uploadResult.url
            }, transaction);

        } else {

            throw new BadRequestError(
                "La hoja de vida es requerida"
            );

        }
        // Validar perfiles
        if (!perfiles || perfiles.length === 0) {
            throw new BadRequestError("El perfil es requerido");
        }

        // 2. Hash contraseña
        const hashedpassword = await bcrypt.hash(password, 10);

        // 3. Crear usuario
        const user = await userRepository.create({
            nombres,
            apellidos,
            cedula,
            correo,
            telefono,
            password: hashedpassword,
            tipo_documento
        }, transaction);

        // 4. Rol
        const rol = await rolRepository.findByNombre("Candidato");

        await user.addRole(rol, { transaction });

        console.log("Usuario creado con ID:", user.id);

        // 5. Crear candidato
        const newCandidato = await candidatoRepository.create({
            codigo,
            hoja_vida_archivo_id: archivoHojaVida.id,
            usuario_id: user.id
        }, transaction);

        console.log("Candidato creado con ID:", newCandidato.id);

        // 6. Registrar perfiles

        for (const perfil of perfilesParseados) {

            const perfilExist = await perfilRepository.findById(
                perfil.perfil_id
            );

            if (!perfilExist) {
                throw new BadRequestError(
                    `PROFILE_NOT_FOUND: ${perfil.perfil_id}`
                );
            }

            await candidatoPerfilRepository.create({
                candidato_id: newCandidato.id,
                perfil_id: perfil.perfil_id,
                calificacion: perfil.calificacion
            }, transaction);
        }

        await transaction.commit();

        return {
            user,
            candidato: newCandidato
        };

    } catch (error) {

        await transaction.rollback();
        throw error;
    }
};