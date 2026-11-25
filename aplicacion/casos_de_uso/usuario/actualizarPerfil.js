import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

// Datos de identidad: se pueden registrar UNA vez (si están vacíos), pero
// una vez guardados el usuario ya no puede cambiarlos desde su perfil.
const CAMPOS_IDENTIDAD = {
    tipo_documento: "El tipo de documento",
    cedula: "El número de documento"
};

const MENSAJE_BLOQUEADO =
    "no se puede modificar. Si hay un error, comunícate con el administrador.";

const tieneValor = (valor) =>
    valor !== null &&
    valor !== undefined &&
    String(valor).trim() !== "";

// ¿El usuario está intentando poner un valor distinto al guardado?
// (enviar el mismo valor, o no enviarlo, no cuenta como cambio)
const intentaCambiar = (actual, nuevo) =>
    tieneValor(nuevo) &&
    String(nuevo).trim() !== String(actual ?? "").trim();

export const actualizarPerfil = async (
    {
        userRepository,
        candidatoRepository,
        PracticanteRepository,
        TutorDocenteRepository,
        tutorEmpresaRepository,
        departamentoRepository,
        municipioRepository
    },
    userId,
    datos,
    rol
) => {

    const transaction = await sequelize.transaction();

    try {

        const usuario = await userRepository.findById(userId, transaction);

        if (!usuario) {
            throw new NotFoundError("Usuario no encontrado");
        }

        // Rechazar cambios a los datos de identidad ya registrados
        for (const [campo, etiqueta] of Object.entries(CAMPOS_IDENTIDAD)) {
            if (
                tieneValor(usuario[campo]) &&
                intentaCambiar(usuario[campo], datos[campo])
            ) {
                throw new BadRequestError(
                    `${etiqueta} ${MENSAJE_BLOQUEADO}`
                );
            }
        }

        // Solo se actualiza lo que sí es editable
        const datosUsuario = {
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            telefono: datos.telefono
        };

        // Identidad: únicamente si todavía estaba vacía (primer registro)
        for (const campo of Object.keys(CAMPOS_IDENTIDAD)) {
            if (!tieneValor(usuario[campo]) && tieneValor(datos[campo])) {
                datosUsuario[campo] = datos[campo];
            }
        }

        // No enviar a la BD los campos que no llegaron
        for (const clave of Object.keys(datosUsuario)) {
            if (datosUsuario[clave] === undefined) {
                delete datosUsuario[clave];
            }
        }

        if (Object.keys(datosUsuario).length > 0) {
            await userRepository.update(userId, datosUsuario, transaction);
        }

        if (rol === "Candidato" || rol === "Practicante") {

            const candidato = await candidatoRepository.findByUserId(
                userId,
                transaction
            );

            if (!candidato) {
                throw new NotFoundError("No se encontró el perfil de candidato");
            }

            // El código NO se puede modificar: las carpetas de archivos
            // del candidato/practicante se nombran con él.
            if (
                tieneValor(candidato.codigo) &&
                intentaCambiar(candidato.codigo, datos.codigo)
            ) {
                throw new BadRequestError(
                    `El código ${MENSAJE_BLOQUEADO}`
                );
            }

            if (!tieneValor(candidato.codigo) && tieneValor(datos.codigo)) {
                await candidatoRepository.update(
                    candidato.id,
                    { codigo: datos.codigo },
                    transaction
                );
            }

            if (rol === "Practicante") {

                const practicante =
                    await PracticanteRepository.findByCandidatoId(
                        candidato.id,
                        transaction
                    );

                if (!practicante) {
                    throw new NotFoundError("No se encontró el perfil de practicante");
                }

                const departamento =
                    await departamentoRepository.findById(
                        datos.departamentoId,
                        transaction
                    );

                if (!departamento) {
                    throw new NotFoundError("Departamento no encontrado");
                }

                const municipio =
                    await municipioRepository.findById(
                        datos.municipioId,
                        transaction
                    );

                if (!municipio) {
                    throw new NotFoundError("Municipio no encontrado");
                }

                if (municipio.departamento_id !== departamento.id) {
                    throw new BadRequestError(
                        "El municipio no pertenece al departamento seleccionado"
                    );
                }

                await PracticanteRepository.update(
                    practicante.id,
                    {
                        eps: datos.eps,
                        codigoDepResidencia: departamento.codigo,
                        codigoMunResidencia: municipio.codigo,
                        fecha_nacimiento: datos.fecha_nacimiento,
                        genero: datos.genero,
                        direccion: datos.direccion,
                        perfil_completado: true
                    },
                    transaction
                );
            }

        } else if (rol === "Tutor Docente") {

            const tutorDocente =
                await TutorDocenteRepository.findByUserId(
                    userId,
                    transaction
                );

            if (!tutorDocente) {
                throw new NotFoundError("No se encontró el perfil de tutor docente");
            }

        } else if (rol === "Tutor Empresarial") {

            const tutorEmpresa =
                await tutorEmpresaRepository.findByUserId(
                    userId,
                    transaction
                );

            if (!tutorEmpresa) {
                throw new NotFoundError("No se encontró el perfil de tutor empresarial");
            }

            await tutorEmpresaRepository.update(
                tutorEmpresa.id,
                { cargo: datos.cargo },
                transaction
            );

        } else {
            throw new BadRequestError("Rol no válido para actualizar el perfil");
        }

        await transaction.commit();

        return {
            message: "Perfil actualizado correctamente"
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};