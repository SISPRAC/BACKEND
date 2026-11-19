export const getTutorEmpresarial = async (tutorEmpresaRepository,empresaRepository, usuarioId) => {

    const empresa = await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        const error = new Error("No se encontró la empresa del usuario");
        error.statusCode = 404;
        throw error;
    }

    const tutorEmpresa = await tutorEmpresaRepository.findByEmpresaId(empresa.id);

    return tutorEmpresa.map(tutor => ({
        id_usuario: tutor.Usuario.id,
        id: tutor.id,
        cargo: tutor.cargo,
        estado: tutor.Usuario.estado,
        nombre: `${tutor.Usuario?.nombres ?? ""} ${tutor.Usuario?.apellidos ?? ""}`.trim(),
        correo: tutor.Usuario.correo,
    }));
};