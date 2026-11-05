export const crearNotificacion = async (
    { notificacionRepository },
    data
) => {

    const notificacion =
        await notificacionRepository.create(
            {
                usuario_id: data.usuario_id,
                titulo: data.titulo,
                descripcion: data.descripcion,
                estado: "SIN_LEER"
            }
        );

    return notificacion;
};