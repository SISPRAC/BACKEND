import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerEmpresasParaReportePorPeriodo = async (
    empresaRepository,
    periodo_id
) => {
    if (!periodo_id) {
        throw new BadRequestError("El periodo no está identificado");
    }

    const [empresas, postulaciones] = await Promise.all([
        empresaRepository.findAllParaReportePorPeriodo(periodo_id),
        empresaRepository.findPracticantesParaReportePorPeriodo(periodo_id),
    ]);

    // Agrupar practicantes por empresa (sin repetidos)
    const practicantesPorEmpresa = new Map();

    for (const postulacion of postulaciones) {
        const vacante = postulacion.AperturaVacante?.Vacante;
        const empresaId = vacante?.Convenio?.empresa_id;
        const candidato = postulacion.Candidato;

        if (!empresaId || !candidato) continue;

        if (!practicantesPorEmpresa.has(empresaId)) {
            practicantesPorEmpresa.set(empresaId, new Map());
        }

        const porCandidato = practicantesPorEmpresa.get(empresaId);

        if (porCandidato.has(candidato.id)) continue;

        porCandidato.set(candidato.id, {
            id: candidato.id,
            codigo: candidato.codigo,
            cedula: candidato.Usuario?.cedula ?? "Sin información",
            nombreCompleto:
                [candidato.Usuario?.nombres, candidato.Usuario?.apellidos]
                    .filter(Boolean)
                    .join(" ") || "Sin información",
            correo: candidato.Usuario?.correo ?? "Sin información",
            vacante: vacante?.nombre ?? "Sin información",
        });
    }

    return empresas.map((empresa) => {
        const practicantes = [
            ...(practicantesPorEmpresa.get(empresa.id)?.values() ?? []),
        ];

        return {
            ...empresa.toJSON(),
            cantidadPracticantes: practicantes.length,
            practicantes,
        };
    });
};