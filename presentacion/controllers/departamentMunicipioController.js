import { obtenerDepartamentos } from "../../aplicacion/casos_de_uso/departamento/obtenerDepartamentos.js";
import { obtenerMunicipiosPorDepartamento } from "../../aplicacion/casos_de_uso/municipio/obtenerMunicipiosPorDepartamento.js";

import { departamentoRepository } from "../../infraestructura/repositorios/departamentoRepositoryImpl.js";
import { municipioRepository } from "../../infraestructura/repositorios/municipioRepositoryImpl.js";

export const getDepartamentos = async (req, res) => {
    try {
        const departamentos = await obtenerDepartamentos({
            departamentoRepository
        });

        return res.status(200).json(departamentos);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Error al obtener departamentos"
        });
    }
};

export const getMunicipiosPorDepartamento = async (req, res) => {
    try {
        const { departamentoId } = req.params;

        const municipios = await obtenerMunicipiosPorDepartamento(
            {
                municipioRepository
            },
            departamentoId
        );

        return res.status(200).json(municipios);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Error al obtener municipios"
        });
    }
};