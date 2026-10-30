import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerGruposParaReportePorPeriodo = async (
    { grupoRepository },
    periodo_id
) => {

    // Validar periodo_id
    if (
        periodo_id === undefined ||
        periodo_id === null ||
        String(periodo_id).trim() === "" ||
        !Number.isInteger(Number(periodo_id)) ||
        Number(periodo_id) <= 0
    ) {
        throw new BadRequestError(
            "El periodo es inválido"
        );
    }

    // Obtener grupos del periodo
    const grupos =
        await grupoRepository.obtenerGruposParaReportePorPeriodo(
            Number(periodo_id)
        );

    // Preparar información para el reporte
    return grupos.map((grupo) => ({
        id: grupo.id,
        nombre: grupo.nombre,

        cantidadPracticantes: Number(grupo.get("cantidadPracticantes") ?? 0),

        estado: grupo.practica?.estado ?? "Sin información",

        tutorDocente: grupo.TutorDocente
            ? {
                id: grupo.TutorDocente.id,
                codigo: grupo.TutorDocente.codigo,
                nombres: grupo.TutorDocente.Usuario?.nombres ?? "",
                apellidos: grupo.TutorDocente.Usuario?.apellidos ?? ""
            }
            : null
    }));
};