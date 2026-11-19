
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";
import { notificarTutorAsignado } from "../notificarEmail/notificarTutorAsignado.js";

export const crearAperturaVacante = async (
    {
        aperturaVacanteRepository,
        vacanteRepository,
        practicaRepository,
        tutorEmpresaRepository,
        convenioRepository,
        empresaRepository,
        notificacionRepository
    },
    data
) => {

    const {
        vacante_id,
        practica_id,
        tutorEmpresa_id,
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
    // VALIDAR TUTOR EMPRESARIAL
    // ============================================================

    if (!tutorEmpresa_id) {
        throw new BadRequestError(
            "Debe seleccionar un tutor empresarial."
        );
    }

    // ============================================================
    // OBTENER VACANTE
    // ============================================================

    const vacante = await vacanteRepository.findById(vacante_id);

    if (!vacante) {
        throw new NotFoundError("La vacante no existe.");
    }

    // ============================================================
    // OBTENER PRÁCTICA
    // ============================================================

    const practica = await practicaRepository.findById(practica_id);

    if (!practica) {
        throw new NotFoundError("La práctica no existe.");
    }

    // ============================================================
    // VALIDAR ESTADO DE LA PRÁCTICA
    // ============================================================

    if (practica.estado === "FINALIZADA") {
        throw new BadRequestError(
            "No se puede crear una apertura de vacante porque la práctica ya está finalizada."
        );
    }

    if (practica.estado !== "EN_CURSO") {
        throw new BadRequestError(
            "No se puede crear una apertura porque la práctica no está en curso."
        );
    }

    // ============================================================
    // VALIDAR FECHA DE FINALIZACIÓN
    // ============================================================

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaFin = new Date(
        `${practica.fecha_fin}T00:00:00`
    );

    if (fechaFin < hoy) {
        throw new BadRequestError(
            "No se puede crear una apertura de vacante porque la fecha de finalización de la práctica ya pasó."
        );
    }

    // ============================================================
    // OBTENER TUTOR EMPRESARIAL
    // ============================================================

    // Este método debe incluir la relación User.
    const tutor = await tutorEmpresaRepository.findById(tutorEmpresa_id);

    if (!tutor) {
        throw new NotFoundError(
            "El tutor empresarial no existe."
        );
    }

    if (!tutor.Usuario?.correo) {
        throw new BadRequestError(
            "El tutor empresarial no tiene un correo electrónico registrado."
        );
    }

    // ============================================================
    // CONVENIO APROBADO DE LA EMPRESA
    // ============================================================

    const empresaId = vacante.Convenio?.empresa_id;

    const convenio = await convenioRepository.findAprobadoByEmpresaId(
        empresaId
    );

    if (!convenio) {
        throw new BadRequestError(
            "La empresa no tiene un convenio aprobado o se encuentra vencido"
        );
    }

    const empresa = await empresaRepository.findById(empresaId);

    if (!empresa) {
        throw new NotFoundError(
            "La empresa de la vacante no existe."
        );
    }

    // ============================================================
    // EVITAR DUPLICADOS
    // ============================================================

    const aperturaExistente =
        await aperturaVacanteRepository.findByVacanteAndPractica(
            vacante_id,
            practica_id
        );

    if (aperturaExistente) {
        throw new BadRequestError(
            "La vacante ya tiene una apertura para esta práctica."
        );
    }

    // ============================================================
    // CREAR APERTURA
    // ============================================================

    const apertura = await aperturaVacanteRepository.create({

        vacante_id,
        tutorEmpresa_id,
        practica_id,
        cupos: Number(cupos),
        estado: data.estado ?? "DISPONIBLE"

    });

    // ============================================================
    // DATOS DEL TUTOR
    // ============================================================

    const usuarioTutor = tutor.Usuario;

    const nombreTutor = [
        usuarioTutor.nombres,
        usuarioTutor.apellidos
    ].filter(Boolean).join(" ");

    // ============================================================
    // NOTIFICACIÓN INTERNA
    // ============================================================

    await crearNotificacion(
        { notificacionRepository },
        {
            usuario_id: tutor.usuario_id,

            titulo: "Asignación como Tutor Empresarial",

            descripcion: `Has sido asignado como tutor empresarial de la vacante "${vacante.nombre}" en la empresa "${empresa.nombre}", correspondiente al período de prácticas ${practica.Periodo.nombre}.`
        }
    );

    // ============================================================
    // NOTIFICACIÓN POR CORREO
    // ============================================================

    const nombrePeriodo =
        practica.Periodo?.nombre ?? practica.periodo_id;

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

    return apertura;

};
