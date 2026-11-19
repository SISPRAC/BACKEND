import jwt from "jsonwebtoken";

export const buildPayload = async (
    user,
    candidatoRepository,
    practicanteRepository
) => {
    const roles = user.Roles.map(r => r.nombre);

    let practicante_id = null;
    const candidato = await candidatoRepository.findByUserId(user.id);

    if (candidato) {
        const practicante = await practicanteRepository.findByCandidatoId(candidato.id);
        if (practicante) {
            practicante_id = practicante.id;
        }
    }

    return {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        roles,
        practicante_id
    };
};

export const buildAuthSession = async (
    user,
    candidatoRepository,
    practicanteRepository
) => {
    const payload = await buildPayload(user, candidatoRepository, practicanteRepository);

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "8h" });

    const { password: _, ...userSinPassword } = user.toJSON();

    return { user: userSinPassword, accessToken, refreshToken };
};