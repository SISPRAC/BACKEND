import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { validarPregunta } from "./validarPregunta.js";

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

        // Validar todas las preguntas antes de escribir en BD
        const tipos = preguntas.map(validarPregunta);


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

        for (const [index, pregunta] of preguntas.entries()) {

            const tipo = tipos[index];

            const nuevaPregunta =
                await preguntaRepository.create(
                    {
                        plantilla_encuesta_id: nuevaEncuesta.id,
                        texto: pregunta.texto,
                        orden: pregunta.orden,
                        tipo
                    },
                    transaction
                );

            // Texto libre: no se crean opciones
            if (tipo === "texto_libre") continue;


            // =========================
            // CREAR OPCIONES
            // =========================

            for (const opcion of pregunta.opciones) {
                await opcionPreguntaRepository.create(
                    {
                        pregunta_id: nuevaPregunta.id,
                        texto: opcion.texto
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