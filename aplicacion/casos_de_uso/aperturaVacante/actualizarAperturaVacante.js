import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const actualizarAperturaVacante = async (
    aperturaVacanteRepository,
    data,
    id
) => {

    const apertura =
        await aperturaVacanteRepository.findById(id);


    if (!apertura) {

        throw new NotFoundError(
            "La apertura de vacante no existe."
        );

    }


    const postulaciones =
        await aperturaVacanteRepository
            .countByAperturaVacante(id);


    // ============================================================
    // NO CAMBIAR VACANTE / PRÁCTICA SI YA TIENE POSTULACIONES
    // ============================================================

    if (
        postulaciones > 0 &&
        (
            data.vacante_id !== undefined ||
            data.practica_id !== undefined
        )
    ) {

        throw new BadRequestError(
            "No se puede cambiar la vacante o la práctica porque la apertura ya tiene postulaciones."
        );

    }


    // ============================================================
    // VALIDAR CUPOS
    // ============================================================

    if (
        data.cupos !== undefined &&
        Number(data.cupos) < 1
    ) {

        throw new BadRequestError(
            "La apertura debe tener al menos un cupo."
        );

    }


    // ============================================================
    // VALIDAR QUE LOS CUPOS NO SEAN MENORES
    // QUE LAS POSTULACIONES EXISTENTES
    // ============================================================

    if (
        data.cupos !== undefined &&
        Number(data.cupos) < postulaciones
    ) {

        throw new BadRequestError(
            `Los cupos no pueden ser menores que las postulaciones existentes (${postulaciones}).`
        );

    }


    const datosActualizar = {};


    if (data.cupos !== undefined) {

        datosActualizar.cupos =
            Number(data.cupos);

    }


    if (data.estado !== undefined) {

        datosActualizar.estado =
            data.estado;

    }


    await aperturaVacanteRepository.update(
        id,
        datosActualizar
    );


    return await aperturaVacanteRepository.findById(
        id
    );

};