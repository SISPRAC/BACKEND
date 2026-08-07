import { uploadArchivo } from "../../../infraestructura/external/storageService.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const retirarPracticante = async (
    retiroPracticanteRepository,
    practicaPracticanteRepository,
    archivoRepository,
    data,
    file
) => {

    const {
        fecha_retiro,
        motivo,
        usuario_id,
        practicante_id
    } = data;

    // 1. Buscar práctica activa del practicante
    const practicaPracticante =
        await practicaPracticanteRepository.findActivaByPracticanteId(
            practicante_id
        );

    if (!practicaPracticante) {
        throw new NotFoundError(
            "El practicante no tiene una práctica activa para retirar."
        );
    }

    // 2. Validar archivo de soporte
    if (!file) {
        throw new BadRequestError(
            "El archivo de soporte es requerido."
        );
    }

    // 3. Subir archivo a Cloudinary
    const uploadResult = await uploadArchivo(
        file.buffer,
        `practicantes/${practicante_id}/retiros`,
        `retiro_${practicante_id}_${Date.now()}`
    );

    // 4. Guardar información del archivo en la BD
   const archivo = await archivoRepository.create({
    nombre: file.originalname,
    url: uploadResult.url,
    public_id: uploadResult.public_id,
    resource_type: uploadResult.resource_type
});

    // 5. Crear registro del retiro
    const retiro = await retiroPracticanteRepository.create({
        fecha_retiro,
        motivo,
        usuario_id,
        practicante_id,
        archivo_id: archivo.id
    });

    // 6. Cambiar estado de la práctica del practicante
    await practicaPracticanteRepository.updateEstado(
        practicaPracticante.id,
        "Retirado"
    );

    return retiro;
};