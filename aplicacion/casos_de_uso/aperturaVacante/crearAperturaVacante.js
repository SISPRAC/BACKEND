import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const crearAperturaVacante = async (
    aperturaVacanteRepository,
    vacanteRepository,
    practicaRepository,
    tutorEmpresaRepository,
    convenioRepository,
    data
) => {

    const {
        vacante_id,
        practica_id,
        cupos
    } = data;


    // ============================================================
    // VALIDAR CUPOS
    // ============================================================

    if (!cupos || Number(cupos) < 1) {

        throw new BadRequestError(
            "La apertura debe tener al menos un cupo."
        );

    }


    // ============================================================
    // OBTENER VACANTE
    // ============================================================

    const vacante =
        await vacanteRepository.findById(
            vacante_id
        );


    if (!vacante) {

        throw new NotFoundError(
            "La vacante no existe."
        );

    }


    // ============================================================
    // OBTENER PRÁCTICA
    // ============================================================

    const practica =
        await practicaRepository.findById(
            practica_id
        );


    if (!practica) {

        throw new NotFoundError(
            "La práctica no existe."
        );

    }


    // ============================================================
    // TUTOR TEMPORAL
    // ============================================================

    const tutorEmpresa_id = 1;


    const tutor =
        await tutorEmpresaRepository.findById(
            tutorEmpresa_id
        );


    if (!tutor) {

        throw new NotFoundError(
            "El tutor empresarial no existe."
        );

    }


    // ============================================================
    // CONVENIO APROBADO DE LA EMPRESA
    // ============================================================

    /*
     * La vacante pertenece a una empresa.
     *
     * Buscamos el convenio aprobado
     * correspondiente a esa empresa.
     */

    const convenio =
        await convenioRepository.findAprobadoByEmpresaId(
            vacante.Convenio?.empresa_id
        );


    if (!convenio) {

        throw new BadRequestError(
            "La empresa de la vacante no tiene un convenio aprobado."
        );

    }


    // ============================================================
    // EVITAR DUPLICADOS
    // ============================================================

    const aperturaExistente =
        await aperturaVacanteRepository
            .findByVacanteAndPractica(
                vacante_id,
                practica_id
            );


    if (aperturaExistente) {

        throw new BadRequestError(
            "La vacante ya tiene una apertura para esta práctica."
        );

    }


    // ============================================================
    // CREAR
    // ============================================================

    const apertura =
        await aperturaVacanteRepository.create({

            vacante_id,

            tutorEmpresa_id,

            practica_id,

            cupos: Number(cupos),

            estado:
                data.estado ?? "DISPONIBLE"

        });


    return apertura;

};