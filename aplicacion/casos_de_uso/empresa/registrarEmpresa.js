import { uploadArchivo } from "../../../infraestructura/external/storageService.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";

import bcrypt from "bcryptjs";

// =========================================================
// CONSTANTES
// =========================================================

const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_DESCRIPCION = 500;

const EXTENSION_POR_MIME = {
    "image/png": "png",
    "image/jpeg": "jpg"
};

// =========================================================
// HELPERS
// (idealmente muévelos a shared/utils/ para reutilizarlos)
// =========================================================

/**
 * "  cARlos   aNDRés " -> "Carlos Andrés"
 */
const normalizarNombre = (valor = "") =>
    String(valor)
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase("es-CO")
        .replace(
            /(^|[\s'-])(\p{L})/gu,
            (_, sep, letra) => sep + letra.toLocaleUpperCase("es-CO")
        );

/**
 * multipart/form-data envía todo como texto: "true" | "false".
 * También acepta booleanos reales (por si llega por JSON).
 */
const parseBoolean = (valor) => {

    if (typeof valor === "boolean") return valor;

    if (valor === "true") return true;
    if (valor === "false") return false;

    return null;
};

// =========================================================
// CASO DE USO
// =========================================================

export const registerEmpresa = async (
    sequelize,
    userRepository,
    empresaRepository,
    rolRepository,
    data,
    file
) => {

    const {
        correo,
        password,
        telefono,
        nit,
        cedula,
        tipo_documento
    } = data;

    // ---------------------------------------------------------
    // 0. NORMALIZAR Y VALIDAR (antes de abrir la transacción)
    // ---------------------------------------------------------

    const nombres = normalizarNombre(data.nombres);
    const apellidos = normalizarNombre(data.apellidos);

    const nombre = String(data.nombre ?? "").trim();
    const direccion = String(data.direccion ?? "").trim();
    const descripcion_perfil = String(data.descripcion_perfil ?? "").trim();

    if (!nombres || !apellidos) {
        throw new BadRequestError(
            "Los nombres y apellidos son obligatorios"
        );
    }

    if (!password || password.length < 8) {
        throw new BadRequestError(
            "La contraseña debe tener mínimo 8 caracteres"
        );
    }

    // Tipo de empresa: pública / privada
    const es_publica = parseBoolean(data.es_publica);

    if (es_publica === null) {
        throw new BadRequestError(
            "El tipo de empresa no es válido"
        );
    }

    // Área que solicitan
    if (!descripcion_perfil) {
        throw new BadRequestError(
            "El área que solicitan es obligatoria"
        );
    }

    if (descripcion_perfil.length > MAX_DESCRIPCION) {
        throw new BadRequestError(
            `El área que solicitan no puede superar los ${MAX_DESCRIPCION} caracteres`
        );
    }

    // Logo: obligatorio, solo PNG/JPG y máximo 2 MB
    if (!file) {
        throw new BadRequestError(
            "El logo de la empresa es obligatorio"
        );
    }

    const extension = EXTENSION_POR_MIME[file.mimetype];

    if (!extension) {
        throw new BadRequestError(
            "El logo debe ser una imagen PNG o JPG"
        );
    }

    if (file.size > MAX_LOGO_BYTES) {
        throw new BadRequestError(
            "El logo no puede superar los 2 MB"
        );
    }

    // ---------------------------------------------------------
    // 1. TRANSACCIÓN
    // ---------------------------------------------------------

    const transaction = await sequelize.transaction();

    try {

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

        // 2. Subir logo
        const uploadResult =
            await uploadArchivo(
                file.buffer,
                `empresas/${nit}/fotos`,
                `logo.${extension}`,
                file.mimetype
            );

        const logoUrl = uploadResult.url;
        const logoPublicId = uploadResult.public_id;

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
                es_publica,
                descripcion_perfil,
                usuario_id: user.id
            }, transaction);

        // 7. Confirmar
        await transaction.commit();

        return {
            user,
            empresa
        };

    } catch (error) {

        // Si el commit ya se ejecutó (o falló), evitar un segundo rollback
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;

    }
};