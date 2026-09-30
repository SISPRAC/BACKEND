export const obtenerNotificacionesUsuario = async (
    { notificacionRepository },
    usuarioId
) => {

    return await notificacionRepository.findByUsuario(
        usuarioId
    );
};