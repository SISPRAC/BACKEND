import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const eliminarVacante = async (
    {
        empresaRepository,
        vacanteRepository
    },
    usuarioId,
    vacanteId
) => {

    const empresa =
        await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró la empresa asociada al usuario"
        );
    }

    const vacante =
        await vacanteRepository.findByIdAndEmpresa(
            vacanteId,
            empresa.id
        );

    if (!vacante) {
        throw new NotFoundError(
            "No se encontró la vacante o no pertenece a la empresa"
        );
    }

    const tieneAperturas =
        await vacanteRepository.existsAperturas(
            vacanteId
        );

    if (tieneAperturas) {

        await vacanteRepository.update(
            vacanteId,
            {
                estado: "CERRADA"
            }
        );

        return {
            eliminada: false,
            cerrada: true,
            mensaje:
                "La vacante tiene aperturas asociadas y fue cerrada correctamente"
        };
    }

    await vacanteRepository.delete(
        vacanteId
    );

    return {
        eliminada: true,
        cerrada: false,
        mensaje:
            "La vacante fue eliminada correctamente"
    };
};