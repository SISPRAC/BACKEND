import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

export const actualizarPerfil = async (
    {
        userRepository,
        candidatoRepository,
        PracticanteRepository,
        departamentoRepository,
        municipioRepository
    },
    userId,
    datos
) => {

    const transaction = await sequelize.transaction();

    try {

        // =========================
        // 1. BUSCAR USUARIO
        // =========================

        const usuario = await userRepository.findById(
            userId,
            transaction
        );

        if (!usuario) {
            throw new NotFoundError(
                "Usuario no encontrado"
            );
        }


        // =========================
        // 2. ACTUALIZAR USUARIO
        // =========================

        const datosUsuario = {
            nombres: datos.nombres,
            apellidos: datos.apellidos,
            tipo_documento: datos.tipo_documento,
            cedula: datos.cedula,
            telefono: datos.telefono
        };

        await userRepository.update(
            userId,
            datosUsuario,
            transaction
        );


        // =========================
        // 3. BUSCAR CANDIDATO
        // =========================

        const candidato =
            await candidatoRepository.findByUserId(
                userId,
                transaction
            );

        if (!candidato) {
            throw new NotFoundError(
                "Candidato no encontrado"
            );
        }


        // =========================
        // 4. ACTUALIZAR CANDIDATO
        // =========================

        await candidatoRepository.update(
            candidato.id,
            {
                codigo: datos.codigo
            },
            transaction
        );


        // =========================
        // 5. BUSCAR PRACTICANTE
        // =========================

        const practicante =
            await PracticanteRepository.findByCandidatoId(
                candidato.id,
                transaction
            );


        // =========================
        // 6. SI ES PRACTICANTE
        // =========================

        if (practicante) {

            // =========================
            // 6.1 BUSCAR DEPARTAMENTO
            // =========================

            const departamento =
                await departamentoRepository.findById(
                    datos.departamentoId,
                    transaction
                );

            if (!departamento) {
                throw new NotFoundError(
                    "Departamento no encontrado"
                );
            }


            // =========================
            // 6.2 BUSCAR MUNICIPIO
            // =========================

            const municipio =
                await municipioRepository.findById(
                    datos.municipioId,
                    transaction
                );

            if (!municipio) {
                throw new NotFoundError(
                    "Municipio no encontrado"
                );
            }


            // =========================
            // 6.3 VALIDAR MUNICIPIO
            // =========================

            if (
                municipio.departamento_id !==
                departamento.id
            ) {
                throw new BadRequestError(
                    "El municipio no pertenece al departamento seleccionado"
                );
            }


            // =========================
            // 6.4 ACTUALIZAR PRACTICANTE
            // =========================

            await PracticanteRepository.update(
                practicante.id,
                {
                    eps: datos.eps,

                    codigoDepResidencia:
                        departamento.codigo,

                    codigoMunResidencia:
                        municipio.codigo,

                    fecha_nacimiento:
                        datos.fecha_nacimiento,

                    genero:
                        datos.genero,

                    direccion:
                        datos.direccion,

                    perfil_completado: true
                },
                transaction
            );
        }


        // =========================
        // 7. CONFIRMAR CAMBIOS
        // =========================

        await transaction.commit();

        return {
            message: "Perfil actualizado correctamente"
        };

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};