export const getTutorDocentes = async (tutorDocenteRepository) => {

    const tutorDocentes = await tutorDocenteRepository.findByAll();

    return tutorDocentes.map(docente => ({
        id_usuario: docente.Usuario.id,
        id: docente.id,
        estado: docente.Usuario.estado,
        codigo: docente.codigo,
        nombre: `${docente.Usuario?.nombres ?? ""} ${docente.Usuario?.apellidos ?? ""}`.trim(),
         correo: docente.Usuario.correo,
    }));
};