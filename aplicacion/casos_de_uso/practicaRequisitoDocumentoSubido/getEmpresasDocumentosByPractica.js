
export const getEmpresasDocumentosByPractica = async (
    { empresaRepository, practicaRepository },
    practica_id
) => {
    const [empresas, requisitos] = await Promise.all([
        empresaRepository.findAllConDocumentosPorPractica(practica_id),
        practicaRepository.findRequisitosDocumentosEmpresa(practica_id),
    ]);

    const documentosRequeridos = requisitos.length;

    return empresas.map((empresa) => {
        // El repositorio devuelve objetos normales, no instancias Sequelize.
        const datos = empresa;

        const documentosSubidos =
            datos.User?.documentosRequisitosSubidos ?? [];

        // Un requisito cuenta una sola vez, aunque tenga varias subidas.
        const documentosPorRequisito = new Map();

        for (const documento of documentosSubidos) {
            const requisitoId =
                documento.practica_requisito_documento_id;

            if (!documentosPorRequisito.has(requisitoId)) {
                documentosPorRequisito.set(requisitoId, documento);
            }
        }

        const documentos = [...documentosPorRequisito.values()];

        const aprobados = documentos.filter(
            (documento) => documento.estado === "APROBADO"
        ).length;

        const pendientes = documentos.filter(
            (documento) => documento.estado === "PENDIENTE"
        ).length;

        const rechazados = documentos.filter(
            (documento) => documento.estado === "RECHAZADO"
        ).length;

        return {
            id: datos.id,
            nombre: datos.nombre,
            nit: datos.nit,
            usuario_id: datos.usuario_id,

            documentosSubidos: documentos.length,
            documentosRequeridos,

            aprobados,
            pendientes,
            rechazados,

            estado:
                pendientes > 0
                    ? "PENDIENTE"
                    : rechazados > 0
                        ? "RECHAZADO"
                        : documentos.length >= documentosRequeridos
                            ? "COMPLETO"
                            : "INCOMPLETO",
        };
    });
};
