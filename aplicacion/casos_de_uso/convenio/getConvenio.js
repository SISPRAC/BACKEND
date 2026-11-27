export const getConvenios = async (
    convenioRepository,
    empresaRequisitoDocumentoRepository,
    tipoRequisitoDocumentoRepository,
    empresaRepository
) => {

    const [convenios, empresas, tipos, docs] = await Promise.all([
        convenioRepository.findAll(),
        empresaRepository.findAllParaConvenios(),
        tipoRequisitoDocumentoRepository.findRequisitosConvenio(),
        empresaRequisitoDocumentoRepository.findAll()
    ]);

    const tiposActivos = tipos.filter((t) => t.estado);

    // empresa_id -> (tipo_requisito_id -> documento), solo los que tienen archivo
    const docsPorEmpresa = new Map();
    for (const d of docs) {
        if (!d.archivo_id) continue;
        if (!docsPorEmpresa.has(d.empresa_id)) docsPorEmpresa.set(d.empresa_id, new Map());
        docsPorEmpresa.get(d.empresa_id).set(d.tipo_requisito_documento_id, d);
    }

    const calcularRequisitos = (empresa_id, es_publica) => {
        const tipoEmpresa = es_publica ? "publica" : "privada";

        const aplicables = tiposActivos.filter(
            (t) => !t.tipo_empresa || t.tipo_empresa === tipoEmpresa
        );

        const docsEmpresa = docsPorEmpresa.get(empresa_id) ?? new Map();
        const subidos = aplicables.filter((t) => docsEmpresa.has(t.id));
        const aprobados = subidos.filter((t) => docsEmpresa.get(t.id).estado === "APROBADO");

        return {
            total: aplicables.length,
            subidos: subidos.length,
            aprobados: aprobados.length,
            completos: aplicables.length > 0 && subidos.length === aplicables.length
        };
    };

    // Empresas con convenio
    const filas = convenios.map((convenio) => ({
        key: `convenio-${convenio.id}`,
        id: convenio.id,
        estado: convenio.estado,
        fechaInicio: convenio.fecha_inicio,
        fechaFin: convenio.fecha_fin,
        empresa: convenio.Empresa?.nombre,
        requisitos: calcularRequisitos(convenio.empresa_id, convenio.Empresa?.es_publica)
    }));

    // Empresas que todavía no tienen ningún convenio
    const conConvenio = new Set(convenios.map((c) => c.empresa_id));

    for (const empresa of empresas) {
        if (conConvenio.has(empresa.id)) continue;

        filas.push({
            key: `empresa-${empresa.id}`,
            id: null,
            estado: "SIN_CONVENIO",
            fechaInicio: null,
            fechaFin: null,
            empresa: empresa.nombre,
            requisitos: calcularRequisitos(empresa.id, empresa.es_publica)
        });
    }

    return filas;
};
