import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const crearPlantillaEncuesta = async (
    sequelize,
    plantillaEncuestaRepository,
    preguntaRepository,
    opcionPreguntaRepository,
    rolRepository,
    data
) => {

    const transaction =
        await sequelize.transaction();

    try {

        const {
            titulo,
            descripcion,
            rol,
            preguntas
        } = data;


        // =========================
        // VALIDACIONES
        // =========================

        if (!titulo || !rol) {

            throw new BadRequestError(
                "Titulo y rol son obligatorios"
            );

        }


        if (
            !preguntas ||
            !Array.isArray(preguntas) ||
            preguntas.length === 0
        ) {

            throw new BadRequestError(
                "Debe registrar al menos una pregunta"
            );

        }


        // =========================
        // BUSCAR ROL POR NOMBRE
        // =========================

        const rolEncontrado =
            await rolRepository.findByNombre(rol);


        if (!rolEncontrado) {

            throw new NotFoundError(
                `El rol "${rol}" no existe`
            );

        }


        // =========================
        // CREAR PLANTILLA
        // =========================

        const nuevaEncuesta =
            await plantillaEncuestaRepository.create(

                {
                    titulo,
                    descripcion,
                    rol_id: rolEncontrado.id
                },

                transaction

            );


        // =========================
        // CREAR PREGUNTAS
        // =========================

        for (const pregunta of preguntas) {

            if (
                !pregunta.texto ||
                !pregunta.texto.trim()
            ) {

                throw new BadRequestError(
                    "Todas las preguntas deben tener un enunciado"
                );

            }


            if (
                !pregunta.opciones ||
                !Array.isArray(pregunta.opciones) ||
                pregunta.opciones.length < 2
            ) {

                throw new BadRequestError(
                    `La pregunta "${pregunta.texto}" debe tener al menos dos opciones`
                );

            }


            const nuevaPregunta =
                await preguntaRepository.create(

                    {
                        plantilla_encuesta_id:
                            nuevaEncuesta.id,

                        texto:
                            pregunta.texto,

                        orden:
                            pregunta.orden

                    },

                    transaction

                );


            // =========================
            // CREAR OPCIONES
            // =========================

            for (const opcion of pregunta.opciones) {

                if (
                    !opcion.texto ||
                    !opcion.texto.trim()
                ) {

                    throw new BadRequestError(
                        `La pregunta "${pregunta.texto}" tiene una opción vacía`
                    );

                }


                await opcionPreguntaRepository.create(

                    {
                        pregunta_id:
                            nuevaPregunta.id,

                        texto:
                            opcion.texto

                    },

                    transaction

                );

            }

        }


        // =========================
        // CONFIRMAR TRANSACCIÓN
        // =========================

        await transaction.commit();


        // =========================
        // RETORNAR ENCUESTA
        // =========================

        return await plantillaEncuestaRepository.findById(
            nuevaEncuesta.id
        );


    } catch (error) {

        await transaction.rollback();

        throw error;

    }

};

