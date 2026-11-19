import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

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

        const datosUsuario = {
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            tipo_documento: datos.tipo_documento,
            cedula: datos.cedula,
            telefono: datos.telefono
        };

        await userRepository.update(userId, datosUsuario, transaction);

        if (rol === "Candidato" || rol === "Practicante") {

            const candidato = await candidatoRepository.findByUserId(
                userId,
                transaction
            );

            if (!candidato) {
                throw new NotFoundError("No se encontró el perfil de candidato");
            }

            await candidatoRepository.update(
                candidato.id,
                { codigo: datos.codigo },
                transaction
            );

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