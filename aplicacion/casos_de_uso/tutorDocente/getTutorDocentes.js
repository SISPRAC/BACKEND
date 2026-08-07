export const getTutorDocentes = async (tutorDocenteRepository) => {

    const tutorDocentes = await tutorDocenteRepository.findByAll();

    return tutorDocentes.map(docente => ({
        id: docente.id,
        codigo: docente.codigo,
        nombre: `${docente.Usuario?.nombres ?? ""} ${docente.Usuario?.apellidos ?? ""}`.trim()
    }));
};