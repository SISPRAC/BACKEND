export const getConvenioByEmpresa = async (
    convenioRepository,
    convenio_id
) => {

    const convenio =
        await convenioRepository.findById(convenio_id);


    if (!convenio) {
        return null;
    }

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
                id: item.User?.id,
                nombre: item.User?.nombres,
                rol: item.User?.Roles?.[0]?.nombre
            }

        })) || []
    };
};

