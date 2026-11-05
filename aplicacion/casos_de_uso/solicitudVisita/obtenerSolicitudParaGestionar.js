import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerSolicitudParaGestionar = async (
    {
        solicitudVisitaRepository,
        tutorDocenteRepository
    },
    solicitudVisitaId,
    usuarioId
) => {

    if (!solicitudVisitaId) {
        throw new BadRequestError(
            "El ID de la solicitud de visita es obligatorio."
        );
    }

    if (!usuarioId) {
        throw new BadRequestError(
            "El ID del usuario autenticado es obligatorio."
        );
    }

    const tutorDocente =
        await tutorDocenteRepository.findByUserId(
            usuarioId
        );

    if (!tutorDocente) {
        throw new NotFoundError(
            "No se encontró un tutor docente asociado al usuario autenticado."
        );
    }

    const solicitud =
        await solicitudVisitaRepository.findByIdForGestionar(
            solicitudVisitaId
        );

    if (!solicitud) {
        throw new NotFoundError(
            "No se encontró la solicitud de visita."
        );
    }

    if (
        Number(solicitud.tutor_docente_id) !==
        Number(tutorDocente.id)
    ) {
        throw new BadRequestError(
            "La solicitud de visita no pertenece al tutor docente autenticado."
        );
    }

    const practicantes =
        await solicitudVisitaRepository.findPracticantesBySolicitudId(
            solicitudVisitaId
        );

    const solicitudJSON = solicitud.toJSON();

    const tutorEmpresarial =
        solicitudJSON.empresa?.TutorEmpresas?.find(
            (tutor) =>
                Number(tutor.usuario_id) ===
                Number(solicitudJSON.usuario_respuesta_id)
        ) || null;

    return {

        id: solicitudJSON.id,

        estado: solicitudJSON.estado,

        observacion:
            solicitudJSON.observacion || null,

        fecha_respuesta:
            solicitudJSON.fecha_respuesta || null,

        empresa:
            solicitudJSON.empresa || null,

        tutorEmpresarial:
            tutorEmpresarial
                ? {
                    id: tutorEmpresarial.id,
                    cargo: tutorEmpresarial.cargo,
                    Usuario:
                        tutorEmpresarial.Usuario
                            ? {
                                id:
                                    tutorEmpresarial.Usuario.id,
                                nombres:
                                    tutorEmpresarial.Usuario.nombres,
                                apellidos:
                                    tutorEmpresarial.Usuario.apellidos
                            }
                            : null
                }
                : null,

        practicantes:
            practicantes.map(
                (item) => {

                    const practicaPracticante =
                        item.practicaPracticante;

                    const practicante =
                        practicaPracticante?.practicante;

                    const candidato =
                        practicante?.candidato;

                    const usuario =
                        candidato?.Usuario;

                    return {
                        id:
                            practicante?.id,

                        codigo:
                            candidato?.codigo,

                        nombres:
                            usuario?.nombres,

                        apellidos:
                            usuario?.apellidos,

                        practicaPracticanteId:
                            practicaPracticante?.id
                    };
                }
            ),

        visita:
            solicitudJSON.visita || null
    };
};