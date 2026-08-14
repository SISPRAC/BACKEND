export const getCandidatos = async (candidatoRepository) => {

    const candidatos = await candidatoRepository.findByAll();

    return candidatos.map(candidato => ({
        id: candidato.id,
        codigo: candidato.codigo,
        nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`.trim()
    }));
};