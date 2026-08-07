export const getCandidatos = async (candidatoRepository) => {

    const candidatos = await candidatoRepository.findByAll();

    return candidatos.map(candidato => ({
        id: candidato.id,
        codigo: candidato.codigo,
        id_grupo: candidato.grupo_id,
        nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`.trim()
    }));
};

export const getCandidatosDisponibles = async (candidatoRepository) => {

    const candidatos = await candidatoRepository.getDisponibles();

    return candidatos.map(candidato => ({
        id: candidato.id,
        codigo: candidato.codigo,
        nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`.trim()
    }));
};
