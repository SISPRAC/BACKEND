export const obtenerMunicipiosPorDepartamento = async (
    {
        municipioRepository
    },
    departamentoId
) => {
    return await municipioRepository.findByDepartamentoId(departamentoId);
};