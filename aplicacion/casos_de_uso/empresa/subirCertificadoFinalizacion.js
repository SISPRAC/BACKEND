import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

import {
    uploadArchivo,
    deleteArchivo,
    rutas
} from "../../../infraestructura/external/storageService.js";

import { notificarCertificadoFinalizacion } from "../notificarEmail/notificarCertificadoFinalizacion.js";

export const subirCertificadoFinalizacion = async (
    sequelize,
    practicaPracticanteRepository,
    archivoRepository,
    empresaRepository,
    userRepository,
    notificacionRepository,
    data
) => {

    const {
        practicante_id,
        usuario_id,
        buffer,
        nombreArchivo,
        mimeType
    } = data;

    // =========================================================
    // VALIDACIONES BÁSICAS
    // =========================================================

    if (!usuario_id) {
        throw new BadRequestError("El usuario es obligatorio");
    }

    if (!practicante_id) {
        throw new BadRequestError("El practicante es obligatorio");
    }

    if (!buffer || !nombreArchivo || !mimeType) {
        throw new BadRequestError("El certificado es obligatorio");
    }

    // =========================================================
    // EMPRESA DEL USUARIO
    // =========================================================

    const empresa = await empresaRepository.findByUserId(usuario_id);

    if (!empresa) {
        throw new BadRequestError("El usuario no pertenece a una empresa");
    }

    // =========================================================
    // PRACTICA DEL PRACTICANTE (En curso, si no Finalizada)
    // =========================================================

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

    // =========================================================
    // NO SE REEMPLAZA
    // =========================================================

    if (practicaPracticante.certificado_archivo_id) {
        throw new BadRequestError(
            "Esta práctica ya tiene un certificado de finalización cargado"
        );
    }

    // =========================================================
    // DATOS DEL PRACTICANTE (candidato + usuario)
    // =========================================================

    const detalle =
        await practicaPracticanteRepository.findByIdWithPracticaAndCandidato(
            practicaPracticante.id
        );

    const candidato = detalle?.practicante?.candidato;

    if (!candidato) {
        throw new NotFoundError("No se encontró el candidato del practicante");
    }

    // =========================================================
    // VALIDAR QUE EL PRACTICANTE ES DE ESTA EMPRESA
    // =========================================================

    const postulaciones =
        await practicaPracticanteRepository.findPostulacionesAceptadasByPracticaAndEmpresa(
            practicaPracticante.practica_id,
            empresa.id
        );

    const pertenece = postulaciones.some(
        (postulacion) => postulacion.candidato_id === candidato.id
    );

    if (!pertenece) {
        throw new BadRequestError(
            "No puedes subir el certificado de un practicante de otra empresa"
        );
    }

    // =========================================================
    // SUBIR ARCHIVO + GUARDAR
    // =========================================================

    const archivoSubido = await uploadArchivo(
        buffer,
        rutas.practicante(
            candidato.codigo ?? `id-${practicante_id}`,
            "certificado_finalizacion"
        ),
        nombreArchivo,
        mimeType
    );

    const transaction = await sequelize.transaction();
    const fechaSubida = new Date();

    try {

        const nuevoArchivo = await archivoRepository.create(
            {
                nombre: nombreArchivo,
                url: archivoSubido.url,
                public_id: archivoSubido.public_id,
                resource_type: archivoSubido.resource_type
            },
            transaction
        );

        await practicaPracticanteRepository.updateCertificado(
            practicaPracticante.id,
            {
                certificado_archivo_id: nuevoArchivo.id,
                certificado_subido_por: usuario_id,
                certificado_fecha_subida: fechaSubida
            },
            transaction
        );

        await transaction.commit();

    } catch (error) {

        await transaction.rollback();

        try {
            await deleteArchivo(archivoSubido.public_id);
        } catch (err) {
            console.error("No se pudo limpiar el certificado subido:", err);
        }

        throw error;
    }

    // =========================================================
    // NOTIFICAR (no debe romper la respuesta si falla)
    // =========================================================

    try {

        const grupo =
            await practicaPracticanteRepository.findGrupoConTutorByPracticaAndCandidato(
                practicaPracticante.practica_id,
                candidato.id
            );

        await notificarCertificadoFinalizacion({
            empresa,
            practicante: candidato.Usuario,
            tutorDocente: grupo?.TutorDocente?.Usuario ?? null,
            fechaSubida,
            userRepository,
            notificacionRepository
        });

    } catch (error) {

        console.error(
            "Error notificando el certificado de finalización:",
            error
        );
    }

    return await practicaPracticanteRepository.findByIdWithCertificado(
        practicaPracticante.id
    );
};