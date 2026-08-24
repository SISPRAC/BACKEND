import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { sequelize } from "../../../infraestructura/database/dbConnection.js";

export const aceptarPostulacion = async (
    {
        postulacionRepository,
        PracticanteRepository,
        practicaPracticanteRepository
    },
    postulacionId,
    datosPracticante
) => {

    const transaction = await sequelize.transaction();

    try {

        const postulacion =
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

        const candidatoId = postulacion.candidato_id;

        const practicaId =
            postulacion.AperturaVacante.practica.id;

        // ==========================================
        // BUSCAR SI EL CANDIDATO YA ES PRACTICANTE
        // ==========================================

        let practicante =
            await PracticanteRepository.findByCandidatoId(
                candidatoId,
                transaction
            );

        // ==========================================
        // SI YA ES PRACTICANTE, VERIFICAR PRÁCTICA ACTIVA
        // ==========================================

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


            practicante = await PracticanteRepository.create(
                {
                    candidato_id: candidatoId
                },
                transaction
            );
        }

            // ==========================================
            // CREAR RELACIÓN PRACTICA-PRACTICANTE
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

            await transaction.commit();

            return {
                postulacion,
                practicante,
                practicaPracticante
            };

        } catch (error) {

            await transaction.rollback();

            throw error;
        }
    };