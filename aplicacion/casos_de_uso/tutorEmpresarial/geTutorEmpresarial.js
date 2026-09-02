export const getTutorEmpresarial = async (tutorEmpresaRepository) => {

    const tutorEmpresa = await tutorEmpresaRepository.findByAll();

    return tutorEmpresa.map(tutor => ({
        id_usuario: tutor.Usuario.id,
        id: tutor.id,
        cargo: tutor.cargo,
        estado: tutor.Usuario.estado,
        nombre: `${tutor.Usuario?.nombres ?? ""} ${tutor.Usuario?.apellidos ?? ""}`.trim(),
        correo: tutor.Usuario.correo,
    }));
};