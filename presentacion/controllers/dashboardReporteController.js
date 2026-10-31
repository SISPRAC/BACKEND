import { getDashboardReporte } from "../../aplicacion/casos_de_uso/reporte/getDashboardReporte.js";
import { reporteRepository } from "../../infraestructura/repositorios/reporteRepositoryImpl.js";
import { periodoRepository } from "../../infraestructura/repositorios/periodoRepositoryImpl.js";

export const getDashboardReporteController = async (req, res) => {
    try {
        const result = await getDashboardReporte(
            { reporteRepository, periodoRepository },
             req.query.periodoId,
        );

        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};