
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerEmpresasParaReportePorPeriodo = async (
    empresaRepository,
    periodo_id
) => {

    if (!periodo_id) {
        throw new BadRequestError(
            "El periodo no está identificado"
        );
    }

    const empresas =
        await empresaRepository.findAllParaReportePorPeriodo(
            periodo_id
        );

    return empresas;
};
