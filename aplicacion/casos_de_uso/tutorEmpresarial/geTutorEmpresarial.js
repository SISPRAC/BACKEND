export const getTutorEmpresarial = async (tutorEmpresaRepository) => {

    const tutorEmpresa = await tutorEmpresaRepository.findByAll();

    return tutorEmpresa.map(tutor => ({
        id: tutor.id,
        cargo: tutor.cargo,
        nombre: `${tutor.Usuario?.nombres ?? ""} ${tutor.Usuario?.apellidos ?? ""}`.trim()
    }));
};