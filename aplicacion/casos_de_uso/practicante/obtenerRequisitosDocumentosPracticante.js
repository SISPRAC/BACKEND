export const obtenerRequisitosDocumentosPracticante = async (
    { practicanteRepository },
    practicanteId
) => {

    const NOMBRES_VALIDOS = [
        "plan de trabajo",
        "informe parcial",
        "informe final"
    ];

    // 1. Traer el rol del practicante
    const practicante =
        await practicanteRepository.findRolPracticante(practicanteId);


         console.log(
        "Practicante encontrado2:",
        practicante.candidato?.Usuario
    );

    if (!practicante) {
        return [];
    }

    console.log(
        "Practicante encontrado despues del if:",
        practicante.candidato?.Usuario
    );

    const rolesAsignados =
        practicante.candidato?.Usuario?.rolesAsignados || [];

    const rolIds = rolesAsignados
        .map((ur) => ur.rol?.id)
        .filter(Boolean);

    if (rolIds.length === 0) {
        return [];
    }

    // 2. Traer los tipos de documento que aplican a ese rol, filtrando solo los 3 que quieres
    const tiposRequisito =
        await practicanteRepository.findTiposRequisitoPorRol(rolIds);

    const tiposFiltrados = tiposRequisito.filter((tipo) => {
        const nombre = tipo.nombre?.trim().toLowerCase();
        return NOMBRES_VALIDOS.includes(nombre);
    });

    if (tiposFiltrados.length === 0) {
        return [];
    }

    const tipoIds = tiposFiltrados.map((tipo) => tipo.id);

    // 3. Traer la práctica en curso del practicante
    const practicaPracticante =
        await practicanteRepository.findPracticaEnCursoPracticante(
            practicanteId
        );

    const practicaId = practicaPracticante?.practica?.id;

    // 4. Traer las fechas reales de esos requisitos para esa práctica (si existen)
    const requisitosPractica = practicaId
        ? await practicanteRepository.findRequisitosDocumentosPractica(
              practicaId,
              tipoIds
          )
        : [];

    // 5. Unir: por cada tipo válido, buscar si ya tiene fechas asignadas en esta práctica
    return tiposFiltrados.map((tipo) => {
        const requisitoPractica = requisitosPractica.find(
            (r) => r.tipo_requisito_documento_id === tipo.id
        );

        return {
            id: requisitoPractica?.id ?? null,
            nombre: tipo.nombre,
            fechaInicio: requisitoPractica?.fecha_inicio ?? null,
            fechaMaxima: requisitoPractica?.fecha_limite ?? null
        };
    });
};