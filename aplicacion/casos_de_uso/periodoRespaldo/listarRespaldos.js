export const listarRespaldos = async (periodoRespaldoRepository) => {
    const respaldos = await periodoRespaldoRepository.findAll();

    // Formato listo para la tabla del admin
    return respaldos.map((r) => ({
        periodo_id: r.periodo_id,
        periodo: r.periodo?.nombre,
        subida: {
            estado: r.estado_subida,          // PENDIENTE | SUBIDO | FALLO
            fecha: r.fecha_subida,
            error: r.error_subida,            // solo trae texto si FALLO
            intentos: r.intentos_subida,
            url: r.drive_folder_url,
        },
        compresion: {
            estado: r.estado_compresion,      // SIN_COMPRIMIR | COMPRIMIDO | FALLO
            fecha: r.fecha_compresion,
            error: r.error_compresion,
            intentos: r.intentos_compresion,
            url: r.drive_zip_url,
        },
    }));
};
