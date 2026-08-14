export const getCandidatosPerfil = async (
    candidatoRepository,
    perfilNombre
) => {

    return await candidatoRepository.findByPerfil(
        perfilNombre
    );
};