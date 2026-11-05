import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const actualizarAperturaVacante = async (
    aperturaVacanteRepository,
    data,
    id
) => {

    // ============================================================
    // BUSCAR APERTURA
    // ============================================================

    const apertura =
        await aperturaVacanteRepository.findById(id);


    if (!apertura) {

        throw new NotFoundError(
            "La apertura de vacante no existe."
        );

    }


    // ============================================================
    // VALIDAR PRÁCTICA
    // ============================================================

    const practica = apertura.practica;


    if (!practica) {

        throw new NotFoundError(
            "La práctica asociada a la apertura no existe."
        );

    }


    if (practica.estado === "FINALIZADA") {

        throw new BadRequestError(
            "No se puede actualizar la apertura de vacante porque la práctica ya está finalizada."
        );

    }


    if (practica.estado !== "EN_CURSO") {

        throw new BadRequestError(
            "No se puede actualizar la apertura porque la práctica no está en curso."
        );

    }


    // ============================================================
    // CONTAR POSTULACIONES
    // ============================================================

    const postulaciones =
        await aperturaVacanteRepository
            .countByAperturaVacante(id);


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
    // QUE LOS CUPOS OCUPADOS
    // ============================================================

    if (
        data.cupos !== undefined &&
        Number(data.cupos) < postulaciones
    ) {

        throw new BadRequestError(
            `Los cupos no pueden ser menores que los cupos ocupados (${postulaciones}).`
        );

    }


    // ============================================================
    // VALIDAR TUTOR EMPRESARIAL
    // ============================================================

    if (
        data.tutorEmpresa_id !== undefined &&
        !data.tutorEmpresa_id
    ) {

        throw new BadRequestError(
            "Debe seleccionar un tutor empresarial."
        );

    }


    // ============================================================
    // PREPARAR DATOS
    // ============================================================

    const datosActualizar = {};


    if (data.tutorEmpresa_id !== undefined) {

        datosActualizar.tutorEmpresa_id =
            Number(data.tutorEmpresa_id);

    }


    if (data.cupos !== undefined) {

        datosActualizar.cupos =
            Number(data.cupos);

    }


    if (data.estado !== undefined) {

        datosActualizar.estado =
            data.estado;

    }


    // ============================================================
    // ACTUALIZAR
    // ============================================================

    await aperturaVacanteRepository.update(
        id,
        datosActualizar
    );


    // ============================================================
    // DEVOLVER APERTURA ACTUALIZADA
    // ============================================================

    return await aperturaVacanteRepository.findById(
        id
    );

};

