import { listarRespaldos } from "../../aplicacion/casos_de_uso/periodoRespaldo/listarRespaldos.js";
import { periodoRespaldoRepository } from "../../infraestructura/repositorios/periodoRespaldoRepositoryImpl.js";

export const listarRespaldosController = async (req, res) => {
    try {
        const respaldos = await listarRespaldos(periodoRespaldoRepository);
        return res.status(200).json(respaldos);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("Error listando respaldos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
