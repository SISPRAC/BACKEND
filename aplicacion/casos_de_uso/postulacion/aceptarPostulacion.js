
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

import { notificarAceptacion } from "../../casos_de_uso/notificarEmail/notificarAceptacion.js";

export const aceptarPostulacion = async (
    {
        postulacionRepository,
        PracticanteRepository,
        practicaPracticanteRepository,
        aperturaVacanteRepository,
        candidatoRepository,
        userRepository
    },
    postulacionId,
) => {

    const transaction = await sequelize.transaction();

    let resultado;
    let postulacion;

    try {

        // ==========================================
        // BUSCAR POSTULACIÓN
        // ==========================================

        postulacion =
            await postulacionRepository.findByIdParaAceptar(
                postulacionId,
                transaction
            );

        if (!postulacion) {
            throw new ConflictError(
                "La postulación no existe"
            );
        }

        if (postulacion.estado !== "POSTULADO") {
            throw new BadRequestError(
                "La postulación ya fue procesada"
            );
        }

        // ==========================================
        // DATOS NECESARIOS
        // ==========================================

        const candidatoId = postulacion.candidato_id;

        const aperturaVacanteId = postulacion.aperturaVacante_id;

        const practicaId = postulacion.AperturaVacante.practica.id;

        const cupos = postulacion.AperturaVacante.cupos;

        // ==========================================
        // BUSCAR CANDIDATO Y SU USUARIO
        // ==========================================

        const candidato = await candidatoRepository.findById(
            candidatoId,
            transaction
        );

        if (!candidato) {
            throw new ConflictError(
                "No se encontró el candidato asociado a la postulación"
            );
        }

        const usuarioId = candidato.usuario_id;

        // ==========================================
        // BUSCAR PRACTICANTE
        // ==========================================

        let practicante =
            await PracticanteRepository.findByCandidatoId(
                candidatoId,
                transaction
            );

        if (practicante) {

            const practicaActiva =
                await practicaPracticanteRepository
                    .findActivaByPracticanteId(
                        practicante.id,
                        transaction
                    );

            if (practicaActiva) {
                throw new BadRequestError(
                    "El candidato ya tiene una práctica en curso"
                );
            }

        } else {

            // ==========================================
            // CREAR PRACTICANTE
            // ==========================================

            practicante =
                await PracticanteRepository.create(
                    {
                        candidato_id: candidatoId
                    },
                    transaction
                );
        }

        // ==========================================
        // CAMBIAR ROL A PRACTICANTE
        // ==========================================

        await userRepository.updateRoles(
            usuarioId,
            ["PRACTICANTE"],
            transaction
        );

        // ==========================================
        // CREAR RELACIÓN PRÁCTICA-PRACTICANTE
        // ==========================================

        const practicaPracticante =
            await practicaPracticanteRepository.create(
                {
                    practica_id: practicaId,
                    practicante_id: practicante.id,
                    estado: "En curso"
                },
                transaction
            );

        // ==========================================
        // ACTUALIZAR POSTULACIÓN
        // ==========================================

        await postulacionRepository.update(
            postulacionId,
            {
                estado: "ACEPTADO",
                fecha_eleccion: new Date()
            },
            transaction
        );

        // ==========================================
        // CONTAR CUPOS OCUPADOS
        // ==========================================

        const cuposOcupados =
            await postulacionRepository.countByAperturaVacante(
                aperturaVacanteId,
                transaction
            );

        console.log("Apertura:", aperturaVacanteId);
        console.log("Cupos totales:", cupos);
        console.log("Cupos ocupados:", cuposOcupados);

        // ==========================================
        // ACTUALIZAR ESTADO DE LA APERTURA
        // ==========================================

        if (cuposOcupados >= cupos) {

            await aperturaVacanteRepository.update(
                aperturaVacanteId,
                {
                    estado: "OCUPADA"
                },
                transaction
            );
        }

        // ==========================================
        // CONFIRMAR TRANSACCIÓN
        // ==========================================

        await transaction.commit();

        resultado = {
            postulacion,
            practicante,
            practicaPracticante
        };

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }

    // ==========================================
    // ENVIAR NOTIFICACIONES
    // ==========================================

    try {

        await notificarAceptacion({
            postulacion,
            userRepository
        });

    } catch (error) {

        console.error(
            "Error al enviar las notificaciones de aceptación:",
            error
        );
    }

    return resultado;
};
