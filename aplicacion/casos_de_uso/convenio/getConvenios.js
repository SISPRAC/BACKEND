export const getConvenios = async (convenioRepository) => {

    const convenios = await convenioRepository.findAll();

    return convenios.map(convenio => ({
        id: convenio.id,
        estado: convenio.estado,
        fechaInicio: convenio.fecha_inicio,
        fechaFin: convenio.fecha_fin,
        empresa : convenio.Empresa?.nombre
    }));
};