import bcrypt from "bcryptjs";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import {
    uploadArchivo,
    deleteArchivo,
    rutas
} from "../../../infraestructura/external/storageService.js";
import { PracticanteRepository } from "../../../infraestructura/repositorios/practicanteRepositoryImpl.js";

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

    // Para limpiar el disco según cómo termine la operación
    let nuevoPublicId = null;
    let archivoAnteriorParaBorrar = null;

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
            perfiles
        } = data;

        const user = await userRepository.findById(
            candidato.usuario_id
        );

        if (!user) {
            throw new BadRequestError(
                "Usuario No encontrado"
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

        // El código NO se puede modificar (las carpetas de archivos del
        // candidato/practicante se nombran con él). Si el front lo envía
        // igual al actual, se ignora; si es distinto, se rechaza.
        if (
            codigo !== undefined &&
            codigo !== null &&
            String(codigo).trim() !== "" &&
            String(codigo).trim() !== String(candidato.codigo)
        ) {
            throw new BadRequestError(
                "CODE_CANNOT_BE_MODIFIED"
            );
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

        if (file) {

            if (file.mimetype !== "application/pdf") {
                throw new BadRequestError(
                    "La hoja de vida debe ser un archivo PDF"
                );
            }

            // 1. Archivo anterior (se borra al final, después del commit)
            let archivoAnterior = null;

            if (candidato.hoja_vida_archivo_id) {

                archivoAnterior =
                    await archivoRepository.findById(
                        candidato.hoja_vida_archivo_id
                    );
            }

            // 2. Carpeta según el estado actual de la persona:
            //    practicante -> practicantes/{codigo}/hoja_vida
            //    candidato   -> candidatos/{codigo}/hoja_vida
            const codigoCandidato = candidato.codigo;

            const practicante =
                await PracticanteRepository.findByCandidatoId(
                    candidato.id
                );

            const carpetaHojaVida = practicante
                ? rutas.practicante(codigoCandidato, "hoja_vida")
                : rutas.candidato(codigoCandidato, "hoja_vida");

            // 3. Subir nuevo archivo
            const uploadResult = await uploadArchivo(
                file.buffer,
                carpetaHojaVida,
                `hoja_vida_${codigoCandidato}.pdf`,
                file.mimetype
            );

            nuevoPublicId = uploadResult.public_id;

            // 4. Crear nuevo registro en Archivos
            const nuevoArchivo =
                await archivoRepository.create(
                    {
                        nombre: file.originalname,
                        url: uploadResult.url,
                        public_id: uploadResult.public_id,
                        resource_type: uploadResult.resource_type
                    },
                    transaction
                );

            // 5. Actualizar referencia del candidato
            candidatoData.hoja_vida_archivo_id =
                nuevoArchivo.id;

            archivoAnteriorParaBorrar = archivoAnterior;
        }

        if (Object.keys(candidatoData).length > 0) {

            await candidatoRepository.update(
                candidato.id,
                candidatoData,
                transaction
            );
        }

        // Ya no hay referencia al archivo anterior: borrar su registro
        if (archivoAnteriorParaBorrar) {

            await archivoRepository.delete(
                archivoAnteriorParaBorrar.id,
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

        // Commit hecho: ahora sí se borra del disco el PDF anterior
        if (archivoAnteriorParaBorrar?.public_id) {
            try {
                await deleteArchivo(archivoAnteriorParaBorrar.public_id);
            } catch (errorStorage) {
                console.error(
                    "No se pudo borrar la hoja de vida anterior del disco:",
                    errorStorage
                );
            }
        }

        return true;

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        // Si se alcanzó a subir un PDF nuevo, no dejarlo huérfano
        if (nuevoPublicId) {
            await deleteArchivo(nuevoPublicId).catch(() => {});
        }

        throw error;

    }
};