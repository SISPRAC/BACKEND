export const obtenerDepartamentos = async ({
    departamentoRepository
}) => {
    return await departamentoRepository.findAll();
};