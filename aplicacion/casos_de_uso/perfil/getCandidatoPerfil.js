 export const getCandidatosPerfil= async ({candidatoRepository}, nombrePerfil) => {

const candidatos = await candidatoRepository.findByPerfil(nombrePerfil);

return candidatos.map(candidato => ({
    id: candidato.id,
    codigo: candidato.codigo,
    nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`.trim(),
    calificacion: candidato.Perfils[0]?.Candidato_perfil?.calificacion
}));
};