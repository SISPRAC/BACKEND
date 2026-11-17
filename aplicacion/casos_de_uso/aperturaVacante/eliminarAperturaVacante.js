
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";
import { notificarTutorDesasignado } from "../notificarEmail/notificarTutorDesasignado.js";

export const eliminarAperturaVacante = async (
    {
        aperturaVacanteRepository,
        tutorEmpresaRepository,
        vacanteRepository,
        empresaRepository,
        notificacionRepository
    },
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
        await aperturaVacanteRepository.countByAperturaVacante(id);

    if (postulaciones > 0) {
        throw new BadRequestError(
            "No se puede eliminar la apertura porque tiene postulaciones."
        );
    }

    // ==========================================
    // OBTENER DATOS DEL TUTOR
    // ==========================================

    const tutor = await tutorEmpresaRepository.findById(
        apertura.tutorEmpresa_id
    );

    if (!tutor) {
        throw new NotFoundError(
            "El tutor empresarial asociado a la apertura no existe."
        );
    }

    const usuarioTutor = tutor.Usuario;

    if (!usuarioTutor?.correo) {
        throw new BadRequestError(
            "El tutor empresarial no tiene un correo electrónico registrado."
        );
    }

    const nombreTutor = [
        usuarioTutor.nombres,
        usuarioTutor.apellidos
    ].filter(Boolean).join(" ");

    // ==========================================
    // OBTENER DATOS DE LA VACANTE Y EMPRESA
    // ==========================================

    const vacante = await vacanteRepository.findById(
        apertura.vacante_id
    );

    if (!vacante) {
        throw new NotFoundError(
            "La vacante asociada a la apertura no existe."
        );
    }

    const empresaId = vacante.Convenio?.empresa_id;

    const empresa = await empresaRepository.findById(empresaId);

    if (!empresa) {
        throw new NotFoundError(
            "La empresa asociada a la vacante no existe."
        );
    }

    const nombrePeriodo =
        practica.Periodo?.nombre ?? practica.periodo_id;

    // ==========================================
    // ELIMINAR APERTURA
    // ==========================================

    await aperturaVacanteRepository.delete(id);

    // ==========================================
    // NOTIFICACIÓN EN PLATAFORMA
    // ==========================================

    await crearNotificacion(
        { notificacionRepository },
        {
            usuario_id: tutor.usuario_id,

            titulo: "Finalización de asignación como Tutor Empresarial",

            descripcion: `Te informamos que la apertura de la vacante "${vacante.nombre}" en la empresa "${empresa.nombre}", correspondiente al período de prácticas ${nombrePeriodo}, ha sido eliminada. Por lo tanto, ya no estás asignado como tutor empresarial para esta apertura.`
        }
    );

    // ==========================================
    // NOTIFICACIÓN POR CORREO
    // ==========================================

    await notificarTutorDesasignado({

        correo: usuarioTutor.correo,

        nombreTutor,

        nombreEmpresa: empresa.nombre,

        nombreVacante: vacante.nombre,

        nombrePeriodo

    });

    return {
        message: "Apertura de vacante eliminada correctamente."
    };

};
