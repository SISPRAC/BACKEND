import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const eliminarAperturaVacante = async (
    aperturaVacanteRepository,
    id
) => {

    // ==========================================
    // BUSCAR APERTURA
    // ==========================================

    const apertura =
        await aperturaVacanteRepository.findById(id);


    if (!apertura) {

        throw new NotFoundError(
            "La apertura de vacante no existe."
        );

    }


    // ==========================================
    // VALIDAR PRÁCTICA
    // ==========================================

    const practica = apertura.practica;

    if (!practica) {

        throw new NotFoundError(
            "La práctica asociada a la apertura no existe."
        );

    }


    if (practica.estado === "FINALIZADA") {

        throw new BadRequestError(
            "No se puede eliminar la apertura de vacante porque la práctica ya está finalizada."
        );

    }


    if (practica.estado !== "EN_CURSO") {

        throw new BadRequestError(
            "No se puede eliminar la apertura porque la práctica no está en curso."
        );

    }


    // ==========================================
    // VALIDAR POSTULACIONES
    // ==========================================

    const postulaciones =
        await aperturaVacanteRepository
            .countByAperturaVacante(id);


    if (postulaciones > 0) {

        throw new BadRequestError(
            "No se puede eliminar la apertura porque tiene postulaciones."
        );

    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    await aperturaVacanteRepository.delete(id);


    return {
        message: "Apertura de vacante eliminada correctamente."
    };

};