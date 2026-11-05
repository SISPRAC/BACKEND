import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerSolicitudesVisitaPorPractica = async (
    {
        tutorEmpresaRepository,
        solicitudVisitaRepository
    },
    user_id,
    practicaId
) => {

    if (!user_id) {
        throw new BadRequestError(
            "El usuario es obligatorio"
        );
    }

    if (!practicaId) {
        throw new BadRequestError(
            "La práctica es obligatoria"
        );
    }

    const tutorEmpresa =
        await tutorEmpresaRepository.findByUserId(
            user_id
        );

    if (!tutorEmpresa) {
        throw new NotFoundError(
            "No se encontró el tutor empresarial"
        );
    }

    if (!tutorEmpresa.empresa_id) {
        throw new NotFoundError(
            "El tutor empresarial no tiene una empresa asociada"
        );
    }

    const solicitudes =
        await solicitudVisitaRepository
            .findSolicitudesByEmpresaAndPractica(
                tutorEmpresa.empresa_id,
                practicaId
            );

    if (!solicitudes || solicitudes.length === 0) {
        return [];
    }

    const practicaPracticanteIds = [];

    solicitudes.forEach((solicitud) => {

        solicitud.practicantes.forEach((item) => {

            if (
                item.practica_practicante_id &&
                !practicaPracticanteIds.includes(
                    item.practica_practicante_id
                )
            ) {
                practicaPracticanteIds.push(
                    item.practica_practicante_id
                );
            }

        });

    });

    const usuarios =
        await solicitudVisitaRepository
            .findUsuariosByPracticaPracticanteIds(
                practicaPracticanteIds
            );

    const usuariosMap = new Map();

    usuarios.forEach((item) => {

        const usuario =
            item.practicante?.candidato?.Usuario;

        usuariosMap.set(
            item.id,
            usuario
        );

    });

    return solicitudes.map((solicitud) => {

        const solicitudData =
            solicitud.toJSON();

        solicitudData.practicantes =
            solicitudData.practicantes.map((item) => {

                const usuario =
                    usuariosMap.get(
                        item.practica_practicante_id
                    );

                return {
                    id: item.id,
                    practica_practicante_id:
                        item.practica_practicante_id,

                    nombres:
                        usuario?.nombres || null,

                    apellidos:
                        usuario?.apellidos || null
                };

            });

        return solicitudData;

    });

};