export const marcarTodasNotificacionesLeidas = async (
    { notificacionRepository },
    usuarioId
) => {

    return await notificacionRepository.marcarTodasLeidas(
        usuarioId
    );
};