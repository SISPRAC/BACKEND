export const getConvenio = async (convenioRepository, id) => {

    const convenio = await convenioRepository.findById(id);

    return {
        id: convenio.id,
        estado: convenio.estado,
        fechaInicio: convenio.fecha_inicio,
        fechaFin: convenio.fecha_fin,
        fechaEnvio: convenio.fecha_envio,
        idEmpresa: convenio.Empresa?.id,
        empresa: convenio.Empresa?.nombre,
        idArchivo: convenio.Archivo?.id,
        archivo: convenio.Archivo?.url,

        historial: convenio.Historial_Convenios?.map((item) => ({

            id: item.id,
            accion: item.accion,
            fecha: item.fecha,
            comentario: item.comentario,
            archivo: {
                id: item.Archivo?.id,
                nombre: item.Archivo?.nombre,
                url: item.Archivo?.url
            },
            usuario: {
                id: item.Usuario?.id,
                nombre: item.Usuario?.nombres,
                rol: item.Usuario?.Roles?.[0]?.nombre
            }


        })) || []
    };
};