import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

export const actualizarPerfil = async (
    {
        userRepository,
        candidatoRepository,
        PracticanteRepository
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

            await PracticanteRepository.update(
                practicante.id,
                {
                    eps: datos.eps,
                    codigoDepResidencia:
                        datos.codigoDepResidencia,
                    codigoMunResidencia:
                        datos.codigoMunResidencia,
                    fecha_nacimiento:
                        datos.fecha_nacimiento,
                    genero: datos.genero,
                    direccion: datos.direccion,
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