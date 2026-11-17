import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerCertificadoFinalizacion = async (
    practicaPracticanteRepository,
    data
) => {

    const { practicante_id } = data;

    if (!practicante_id) {
        throw new BadRequestError("El practicante es obligatorio");
    }

    // Mismo criterio que al subir: En curso, si no Finalizada
    const practicaPracticante =
        (await practicaPracticanteRepository.findActivaByPracticanteId(
            practicante_id
        )) ??
        (await practicaPracticanteRepository.findFinalizadaByPracticanteId(
            practicante_id
        ));

    if (!practicaPracticante) {
        throw new NotFoundError(
            "El practicante no tiene una práctica en curso o finalizada"
        );
    }

    const registro =
        await practicaPracticanteRepository.findByIdWithCertificado(
            practicaPracticante.id
        );

    if (!registro?.certificadoArchivo) {
        throw new NotFoundError(
            "Esta práctica aún no tiene certificado de finalización"
        );
    }

    const archivo = registro.certificadoArchivo;

    return {
        id: archivo.id,
        nombre: archivo.nombre,
        url: archivo.url,
        resource_type: archivo.resource_type,
        subido_por: registro.certificado_subido_por,
        fecha_subida: registro.certificado_fecha_subida
    };
};