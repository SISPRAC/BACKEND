export const getCandidatosDisponibles = async (candidatoRepository) => {

    const candidatos = await candidatoRepository.getDisponibles();

    return candidatos.map(candidato => ({
        id: candidato.id,
        codigo: candidato.codigo,
        nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`.trim()
    }));
};