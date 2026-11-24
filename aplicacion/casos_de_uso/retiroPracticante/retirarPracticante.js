import { sequelize } from "../../../infraestructura/database/dbConnection.js";
import { PracticanteRepository as practicanteRepository } from "../../../infraestructura/repositorios/practicanteRepositoryImpl.js";

import {
    uploadArchivo,
    deleteArchivo,
    rutas
} from "../../../infraestructura/external/storageService.js";

import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import { notificarRetiroPracticante } from "../notificarEmail/notificarRetiroPracticante.js";

const ESTADO_RETIRADO = "Retirado";
const ESTADO_CANCELADO = "Cancelado";

export const retirarPracticante = async (
    retiroPracticanteRepository,
    practicaPracticanteRepository,
    archivoRepository,
    data,
    file,
    postulacionRepository,
    userRepository,
    notificacionRepository
) => {

    const {
        motivo,
        usuario_id,
        practicante_id,
        esAutoRetiro = false
    } = data;

    // Validar archivo de soporte antes de abrir la transacción
    if (!file) {
        throw new BadRequestError(
            "El archivo de soporte es requerido."
        );
    }

    const fecha_retiro = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());

    const transaction = await sequelize.transaction();

    let publicId = null;
    let retiro;
    let practicaPracticanteId;

    try {

        // 1. Buscar práctica activa del practicante
        const practicaPracticante =
            await practicaPracticanteRepository.findActivaByPracticanteId(
                practicante_id,
                transaction
            );

        if (!practicaPracticante) {
            throw new NotFoundError(
                "El practicante no tiene una práctica activa para retirar."
            );
        }

        practicaPracticanteId = practicaPracticante.id;

        // 2. Subir archivo a storage (carpeta del practicante)
        const practicante =
            await practicanteRepository.findById(practicante_id);

        const codigoPracticante =
            practicante?.candidato?.codigo ?? `id-${practicante_id}`;

        const uploadResult = await uploadArchivo(
            file.buffer,
            rutas.practicante(codigoPracticante, "retiros"),
            `retiro_${practicante_id}_${Date.now()}`,
            file.mimetype
        );

        publicId = uploadResult.public_id;

        // 3. Guardar información del archivo en la BD
        const archivo = await archivoRepository.create(
            {
                nombre: file.originalname,
                url: uploadResult.url,
                public_id: uploadResult.public_id,
                resource_type: uploadResult.resource_type
            },
            transaction
        );

        // 4. Crear registro del retiro
        retiro = await retiroPracticanteRepository.create(
            {
                fecha_retiro,
                motivo,
                usuario_id,
                practicante_id,
                practica_practicante_id: practicaPracticante.id,
                archivo_id: archivo.id
            },
            transaction
        );

        // 5. Cambiar estado de la práctica del practicante
        await practicaPracticanteRepository.updateEstado(
            practicaPracticante.id,
            esAutoRetiro ? ESTADO_CANCELADO : ESTADO_RETIRADO,
            transaction
        );

        // 6. Confirmar
        await transaction.commit();

    } catch (error) {

        if (!transaction.finished) {
            await transaction.rollback();
        }

        // Eliminar el archivo subido si falló la operación
        if (publicId) {
            try {
                await deleteArchivo(publicId);
            } catch (errorStorage) {
                console.error(
                    "No se pudo eliminar el archivo del retiro tras el error:",
                    errorStorage
                );
            }
        }

        throw error;
    }

    // 7. Notificar (fuera de la transacción, no afecta el retiro si falla)
    try {

        await notificarRetiroPracticante({
            practicaPracticanteId,
            usuarioRetiroId: usuario_id,
            esAutoRetiro,
            motivo,
            fechaRetiro: fecha_retiro,
            practicaPracticanteRepository,
            postulacionRepository,
            userRepository,
            notificacionRepository
        });

    } catch (errorNotificacion) {
        console.error(
            "Error notificando el retiro del practicante:",
            errorNotificacion
        );
    }

    return retiro;
};