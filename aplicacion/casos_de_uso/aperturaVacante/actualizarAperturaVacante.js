
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";
import { notificarTutorAsignado } from "../notificarEmail/notificarTutorAsignado.js";

export const actualizarAperturaVacante = async (
    {
        aperturaVacanteRepository,
        tutorEmpresaRepository,
        vacanteRepository,
        empresaRepository,
        notificacionRepository
    },
    data,
    id
) => {

    // ============================================================
    // BUSCAR APERTURA
    // ============================================================

    const apertura = await aperturaVacanteRepository.findById(id);

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
        await aperturaVacanteRepository.countByAperturaVacante(id);

    // ============================================================
    // VALIDAR CUPOS
    // ============================================================

    if (
        data.cupos !== undefined &&
        (!Number.isInteger(Number(data.cupos)) ||
            Number(data.cupos) < 1)
    ) {
        throw new BadRequestError(
            "La apertura debe tener al menos un cupo válido."
        );
    }

    // ============================================================
    // VALIDAR CUPOS OCUPADOS
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
    // DETECTAR CAMBIO DE TUTOR
    // ============================================================

    const cambioTutor =
        data.tutorEmpresa_id !== undefined &&
        Number(data.tutorEmpresa_id) !== Number(apertura.tutorEmpresa_id);

    let nuevoTutor = null;

    if (data.tutorEmpresa_id !== undefined) {

        if (!data.tutorEmpresa_id) {
            throw new BadRequestError(
                "Debe seleccionar un tutor empresarial."
            );
        }

        if (cambioTutor) {

            nuevoTutor = await tutorEmpresaRepository.findById(
                Number(data.tutorEmpresa_id)
            );

            if (!nuevoTutor) {
                throw new NotFoundError(
                    "El tutor empresarial no existe."
                );
            }

            if (!nuevoTutor.User?.correo) {
                throw new BadRequestError(
                    "El tutor empresarial no tiene un correo registrado."
                );
            }

        }
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
        datosActualizar.cupos = Number(data.cupos);
    }

    if (data.estado !== undefined) {
        datosActualizar.estado = data.estado;
    }

    // ============================================================
    // ACTUALIZAR
    // ============================================================

    await aperturaVacanteRepository.update(
        id,
        datosActualizar
    );

    // ============================================================
    // NOTIFICAR NUEVO TUTOR
    // ============================================================

    if (cambioTutor) {

        const vacante = await vacanteRepository.findById(
            apertura.vacante_id
        );

        if (!vacante) {
            throw new NotFoundError(
                "La vacante asociada a la apertura no existe."
            );
        }

        const empresaId = vacante.Convenio?.empresa_id;

        const empresa = await empresaRepository.findById(
            empresaId
        );

        if (!empresa) {
            throw new NotFoundError(
                "La empresa de la vacante no existe."
            );
        }

        const usuarioTutor = nuevoTutor.User;

        const nombreTutor = [
            usuarioTutor.nombres,
            usuarioTutor.apellidos
        ].filter(Boolean).join(" ");

        const nombrePeriodo =
            practica.Periodo?.nombre ?? practica.periodo_id;

        // --------------------------------------------------------
        // NOTIFICACIÓN INTERNA
        // --------------------------------------------------------

        await crearNotificacion(
            { notificacionRepository },
            {
                usuario_id: nuevoTutor.usuario_id,

                titulo: "Asignación como Tutor Empresarial",

                descripcion: `Has sido asignado como tutor empresarial de la vacante "${vacante.nombre}" en la empresa "${empresa.nombre}", correspondiente al período de prácticas ${nombrePeriodo}.`
            }
        );

        // --------------------------------------------------------
        // NOTIFICACIÓN POR CORREO
        // --------------------------------------------------------

        await notificarTutorAsignado({

            correo: usuarioTutor.correo,

            nombreTutor,

            nombreEmpresa: empresa.nombre,

            nombreVacante: vacante.nombre,

            nombrePeriodo,

            cupos: data.cupos ?? apertura.cupos,

            fechaInicio: practica.fecha_inicio,

            fechaFin: practica.fecha_fin

        });

    }

    // ============================================================
    // DEVOLVER APERTURA ACTUALIZADA
    // ============================================================

    return await aperturaVacanteRepository.findById(id);

};
