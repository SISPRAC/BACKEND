export const obtenerNotificacionesNoLeidas = async (
    { notificacionRepository },
    usuarioId
) => {

    return await notificacionRepository.findNoLeidasByUsuario(
        usuarioId
    );
};