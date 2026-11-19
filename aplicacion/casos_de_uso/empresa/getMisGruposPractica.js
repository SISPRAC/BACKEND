import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerGruposEmpresa = async (
    empresaRepository,
    practicaRepository,
    aperturaVacanteRepository,
    practicaPracticanteRepository,
    usuarioId
) => {

    // 1. Empresa del usuario autenticado
    const empresa = await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró una empresa asociada al usuario"
        );
    }

    // 2. Prácticas disponibles y aperturas que la empresa ya tiene
    const [practicas, aperturas] = await Promise.all([
        practicaRepository.findAllConPeriodo(),
        aperturaVacanteRepository.findByEmpresaId(empresa.id)
    ]);

    // 3. Agrupar las aperturas por practica_id
    const aperturasPorPractica = {};

    for (const apertura of aperturas) {
        (aperturasPorPractica[apertura.practica_id] ??= []).push({
            id: apertura.id,
            vacante_id: apertura.vacante_id,
            cupos: apertura.cupos,
            estado: apertura.estado,
            vacante: {
                id: apertura.Vacante.id,
                nombre: apertura.Vacante.nombre,
                descripcion: apertura.Vacante.descripcion
            }
        });
    }

    // 4. Armar los grupos (en paralelo)
    return await Promise.all(
        practicas.map(async (practica) => {

            const susAperturas = aperturasPorPractica[practica.id] ?? [];

            // Solo tiene sentido contar si la empresa ya tiene aperturas
            const practicantes = susAperturas.length > 0
                ? await practicaPracticanteRepository.countByPracticaAndEmpresa(
                    practica.id,
                    empresa.id
                )
                : 0;

            return {
                practica_id: practica.id,
                periodo_id: practica.Periodo.id,
                periodo: practica.Periodo.nombre,
                fecha_inicio: practica.fecha_inicio,
                fecha_fin: practica.fecha_fin,
                estado: practica.estado,
                practicantes,
                aperturas: susAperturas
            };
        })
    );

};