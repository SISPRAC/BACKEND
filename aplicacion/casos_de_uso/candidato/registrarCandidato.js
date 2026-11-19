import {
    uploadArchivo,
    deleteArchivo
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import bcrypt from "bcryptjs";

// ==========================================
// NORMALIZAR NOMBRES Y APELLIDOS
// ==========================================

const normalizarNombreCompleto = (valor) => {

    if (!valor || typeof valor !== "string") {
        return valor;
    }

    return valor
        .normalize("NFC")
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase("es-CO")
        .replace(/(^|[\s'-])(\p{L})/gu, (coincidencia, separador, letra) => {
            return separador + letra.toLocaleUpperCase("es-CO");
        });
};

// ==========================================
// PARSEAR ARRAYS
// ==========================================

const parsearArray = (valor, nombre) => {

    if (!valor) return [];

    let resultado = valor;

    if (typeof valor === "string") {
        try {
            resultado = JSON.parse(valor);
        } catch (error) {
            throw new BadRequestError(
                `El formato de ${nombre} no es válido`
            );
        }
    }

    if (!Array.isArray(resultado)) {
        throw new BadRequestError(
            `El formato de ${nombre} debe ser una lista`
        );
    }

    return resultado;
};

export const registerCandidato = async (
    sequelize,
    userRepository,
    candidatoRepository,
    rolRepository,
    perfilRepository,
    candidatoPerfilRepository,
    habilidadBlandaRepository,
    candidatoHabilidadBlandaRepository,
    idiomaRepository,
    candidatoIdiomaRepository,
    archivoRepository,
    grupoCandidatoRepository,
    data,
    file
) => {

    const {
        correo,
        codigo,
        grupo_id,
        password,
        telefono,
        cedula,
        nombres,
        apellidos,
        tipo_documento,
        perfiles,
        habilidadesBlandas,
        idiomas
    } = data;

    const transaction = await sequelize.transaction();

    // Guardamos la ruta del archivo para poder eliminarlo si falla el registro
    let archivoPublicId = null;

    try {

        // ==========================================
        // 1. NORMALIZAR NOMBRES Y APELLIDOS
        // ==========================================

        const nombresNormalizados =
            normalizarNombreCompleto(nombres);

        const apellidosNormalizados =
            normalizarNombreCompleto(apellidos);

        // ==========================================
        // 2. PARSEAR INFORMACIÓN DEL PERFIL
        // ==========================================

        const perfilesParseados = parsearArray(
            perfiles,
            "perfiles"
        );

        const habilidadesParseadas = parsearArray(
            habilidadesBlandas,
            "habilidades blandas"
        );

        const idiomasParseados = parsearArray(
            idiomas,
            "idiomas"
        );

        if (perfilesParseados.length === 0) {
            throw new BadRequestError(
                "Debes registrar al menos un perfil técnico"
            );
        }

        // ==========================================
        // 3. VALIDAR DATOS DEL USUARIO
        // ==========================================

        const exist =
            await userRepository.findBycorreo(correo) ||
            await userRepository.findByCedula(cedula) ||
            await candidatoRepository.findByCodigo(codigo);

        if (exist) {
            throw new ConflictError(
                "Ya existe un usuario con esos datos"
            );
        }

        // ==========================================
        // 4. VALIDAR Y SUBIR HOJA DE VIDA
        // ==========================================

        if (!file) {
            throw new BadRequestError(
                "La hoja de vida es requerida"
            );
        }

        if (file.mimetype !== "application/pdf") {
            throw new BadRequestError(
                "La hoja de vida debe ser un archivo PDF"
            );
        }

        const uploadResult = await uploadArchivo(
            file.buffer,
            `candidatos/${codigo}/documentos`,
            `hoja_vida_${codigo}.pdf`,
            file.mimetype
        );

        // Guardamos el identificador para una posible eliminación
        archivoPublicId = uploadResult.public_id;

        const archivoHojaVida = await archivoRepository.create({
            nombre: file.originalname,
            url: uploadResult.url
        }, transaction);

        // ==========================================
        // 5. HASH CONTRASEÑA
        // ==========================================

        const hashedpassword = await bcrypt.hash(password, 10);

        // ==========================================
        // 6. CREAR USUARIO
        // ==========================================

        const user = await userRepository.create({
            nombres: nombresNormalizados,
            apellidos: apellidosNormalizados,
            cedula,
            correo,
            telefono,
            password: hashedpassword,
            tipo_documento
        }, transaction);

        // ==========================================
        // 7. ASIGNAR ROL
        // ==========================================

        const rol = await rolRepository.findByNombre("Candidato");

        if (!rol) {
            throw new BadRequestError(
                "No se encontró el rol Candidato"
            );
        }

        await user.addRole(rol, { transaction });

        // ==========================================
        // 8. CREAR CANDIDATO
        // ==========================================

        const newCandidato = await candidatoRepository.create({
            codigo,
            hoja_vida_archivo_id: archivoHojaVida.id,
            usuario_id: user.id
        }, transaction);

        // ==========================================
        // 9. REGISTRAR PERFILES TÉCNICOS
        // ==========================================

        const nivelesPerfil = ["R", "B", "MB"];

        for (const perfil of perfilesParseados) {

            if (!perfil.perfil_id || !perfil.nivel) {
                throw new BadRequestError(
                    "Cada perfil técnico debe tener un perfil y un nivel"
                );
            }

            if (!nivelesPerfil.includes(perfil.nivel)) {
                throw new BadRequestError(
                    `El nivel ${perfil.nivel} no es válido`
                );
            }

            const perfilExist = await perfilRepository.findById(
                perfil.perfil_id
            );

            if (!perfilExist) {
                throw new BadRequestError(
                    `No se encontró el perfil técnico ${perfil.perfil_id}`
                );
            }

            await candidatoPerfilRepository.create({
                candidato_id: newCandidato.id,
                perfil_id: perfil.perfil_id,
                nivel: perfil.nivel
            }, transaction);
        }

        // ==========================================
        // 10. REGISTRAR HABILIDADES BLANDAS
        // ==========================================

        for (const habilidad of habilidadesParseadas) {

            let habilidadBlanda;

            if (habilidad.habilidad_blanda_id) {

                // Buscar habilidad existente
                habilidadBlanda =
                    await habilidadBlandaRepository.findById(
                        habilidad.habilidad_blanda_id
                    );

                if (!habilidadBlanda) {
                    throw new BadRequestError(
                        `No se encontró la habilidad ${habilidad.habilidad_blanda_id}`
                    );
                }

            } else if (habilidad.nombre) {

                // Normalizar nombre de la habilidad
                const nombre = habilidad.nombre.trim();

                if (!nombre) {
                    throw new BadRequestError(
                        "El nombre de la habilidad no puede estar vacío"
                    );
                }

                // Verificar si ya existe
                habilidadBlanda =
                    await habilidadBlandaRepository.findByName(nombre);

                // Crear si no existe
                if (!habilidadBlanda) {

                    habilidadBlanda =
                        await habilidadBlandaRepository.create({
                            nombre
                        }, transaction);
                }

            } else {
                throw new BadRequestError(
                    "Cada habilidad debe tener un ID o un nombre"
                );
            }

            // Asignar habilidad al candidato
            await candidatoHabilidadBlandaRepository.create({
                candidato_id: newCandidato.id,
                habilidad_blanda_id: habilidadBlanda.id
            }, transaction);
        }

        // ==========================================
        // 11. REGISTRAR IDIOMAS
        // ==========================================

        const nivelesIdioma = [
            "A1",
            "A2",
            "B1",
            "B2",
            "C1",
            "C2",
            "NATIVO"
        ];

        for (const idioma of idiomasParseados) {

            if (
                !idioma.idioma_id ||
                !idioma.lee ||
                !idioma.habla ||
                !idioma.escucha
            ) {
                throw new BadRequestError(
                    "Cada idioma debe tener su nivel de lectura, habla y escucha"
                );
            }

            const idiomaExist = await idiomaRepository.findById(
                idioma.idioma_id
            );

            if (!idiomaExist) {
                throw new BadRequestError(
                    `No se encontró el idioma ${idioma.idioma_id}`
                );
            }

            if (
                !nivelesIdioma.includes(idioma.lee) ||
                !nivelesIdioma.includes(idioma.habla) ||
                !nivelesIdioma.includes(idioma.escucha)
            ) {
                throw new BadRequestError(
                    "Uno de los niveles del idioma no es válido"
                );
            }

            await candidatoIdiomaRepository.create({
                candidato_id: newCandidato.id,
                idioma_id: idioma.idioma_id,
                lee: idioma.lee,
                habla: idioma.habla,
                escucha: idioma.escucha
            }, transaction);
        }

        // ==========================================
        // 12. ASIGNAR GRUPO SI EXISTE
        // ==========================================

        if (grupo_id) {

            await grupoCandidatoRepository.create({
                grupo_id,
                candidato_id: newCandidato.id
            }, transaction);
        }

        // ==========================================
        // 13. CONFIRMAR TRANSACCIÓN
        // ==========================================

        await transaction.commit();

        return {
            user,
            candidato: newCandidato
        };

    } catch (error) {

        // ==========================================
        // 14. REVERTIR TRANSACCIÓN
        // ==========================================

        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error(
                "Error al revertir la transacción:",
                rollbackError
            );
        }

        // ==========================================
        // 15. ELIMINAR ARCHIVO DE SUPABASE
        // ==========================================

        if (archivoPublicId) {

            try {
                await deleteArchivo(archivoPublicId);

            } catch (deleteError) {

                console.error(
                    "No se pudo eliminar la hoja de vida de Supabase:",
                    deleteError
                );
            }
        }

        throw error;
    }
};