const PESO_PERFIL = { R: 1, B: 2, MB: 3 };
const NIVELES_IDIOMA = ["A1", "A2", "B1", "B2", "C1", "C2", "NATIVO"];

export const getCandidatos = async (candidatoRepository) => {

    const candidatos = await candidatoRepository.findAllConPerfiles();

    return candidatos.map((candidato) => {

        // ── Perfiles técnicos, del mejor nivel al peor (MB > B > R) ───────
        const perfiles = (candidato.Perfils ?? [])
            .map((p) => ({
                nombre: p.nombre,
                nivel: p.Candidato_perfil?.nivel ?? null,
            }))
            .sort((a, b) => (PESO_PERFIL[b.nivel] ?? 0) - (PESO_PERFIL[a.nivel] ?? 0));

        // ── Inglés: lee / habla / escucha ─────────────────────────────────
        const ingles = (candidato.idiomas ?? []).find((i) =>
            /ingl[eé]s/i.test(i.nombre)
        );

        const detalleIngles = ingles
            ? {
                lee: ingles.Candidato_idioma?.lee,
                habla: ingles.Candidato_idioma?.habla,
                escucha: ingles.Candidato_idioma?.escucha,
            }
            : null;

        // Nivel global = el más bajo de las tres habilidades (criterio conservador)
        const nivelIngles = detalleIngles
            ? Object.values(detalleIngles)
                .filter(Boolean)
                .sort((a, b) => NIVELES_IDIOMA.indexOf(a) - NIVELES_IDIOMA.indexOf(b))[0] ?? null
            : null;

        return {
            id: candidato.id,
            codigo: candidato.codigo,
            nombre: `${candidato.Usuario?.nombres ?? ""} ${candidato.Usuario?.apellidos ?? ""}`.trim(),
            correo: candidato.Usuario?.correo ?? "",
            telefono: candidato.Usuario?.telefono ?? "",

            perfilTecnico: perfiles[0]?.nombre ?? null,
            nivelPerfilTecnico: perfiles[0]?.nivel ?? null,
            perfiles,

            habilidadesBlandas: (candidato.habilidadesBlandas ?? []).map((h) => h.nombre),

            nivelIngles,
            detalleIngles,
        };
    });
};