export const verificarCandidatosPdf = async (candidatoRepository, alumnos = []) => {

    if (!Array.isArray(alumnos) || alumnos.length === 0) {
        const error = new Error("Debe enviar la lista de alumnos.");
        error.statusCode = 400;
        throw error;
    }

    const correos = alumnos
        .map(a => a.correo?.toLowerCase().trim())
        .filter(Boolean);

    const codigos = alumnos
        .map(a => a.codigo)
        .filter(Boolean);

    const registrados = await candidatoRepository.findByCorreosOCodigos(
        correos,
        codigos
    );

    const encontrados = [];
    const noEncontrados = [];
    const yaAgregados = new Set();

    for (const alumno of alumnos) {

        const correo = alumno.correo?.toLowerCase().trim();

        // 1. Por correo (único), 2. por código
        const candidato =
            registrados.find(c => c.Usuario?.correo?.toLowerCase().trim() === correo) ||
            registrados.find(c => c.codigo === alumno.codigo);

        if (candidato) {
            if (!yaAgregados.has(candidato.id)) {
                yaAgregados.add(candidato.id);
                encontrados.push({
                    id: candidato.id,
                    codigo: candidato.codigo,
                    correo: candidato.Usuario.correo,
                    nombre: `${candidato.Usuario.nombres} ${candidato.Usuario.apellidos}`.trim()
                });
            }
        } else {
            noEncontrados.push(alumno);
        }
    }

    return { encontrados, noEncontrados };
};