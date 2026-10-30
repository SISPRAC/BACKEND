import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const obtenerCandidatosParaReportePorPeriodo = async (
    { candidatoRepository },
    periodo_id
) => {
    if (
        periodo_id === undefined ||
        periodo_id === null ||
        String(periodo_id).trim() === "" ||
        !Number.isInteger(Number(periodo_id)) ||
        Number(periodo_id) <= 0
    ) {
        throw new BadRequestError("El periodo no está identificado");
    }

    const periodoId = Number(periodo_id);

    const candidatos =
        await candidatoRepository.findAllParaReportePorPeriodo(
            periodoId
        );

    const candidatosFiltrados = candidatos.filter((candidato) => {
        const practicante = candidato.practicante;

        const tienePractica = (practicante?.practicas ?? []).some(
            (registro) =>
                Number(registro.practica?.periodo_id) === periodoId
        );

        const tienePostulacion = (candidato.Postulacions ?? []).some(
            (postulacion) =>
                Number(
                    postulacion.AperturaVacante?.practica?.periodo_id
                ) === periodoId
        );

        return tienePractica || tienePostulacion;
    });

    return candidatosFiltrados.map((candidato) => {
        const postulaciones = (candidato.Postulacions ?? [])
            .filter(
                (postulacion) =>
                    postulacion.AperturaVacante &&
                    Number(
                        postulacion.AperturaVacante.practica?.periodo_id
                    ) === periodoId
            )
            .sort((a, b) => b.id - a.id);

        const practicante = candidato.practicante;

        const practicas = (practicante?.practicas ?? [])
            .filter(
                (registro) =>
                    Number(registro.practica?.periodo_id) === periodoId
            )
            .sort((a, b) => b.id - a.id);

        const practicaActual =
            practicas.find(
                (registro) => registro.estado === "En curso"
            ) ?? practicas[0];

        const postulacionActual = postulaciones[0];

        const apertura = postulacionActual?.AperturaVacante;
        const vacante = apertura?.Vacante;
        const empresa = vacante?.Convenio?.Empresa;

        const grupos = (candidato.gruposAsignados ?? [])
            .map((asignacion) => asignacion.grupo)
            .filter(Boolean);

        let estado;

        if (practicaActual) {
            estado = practicaActual.estado;
        } else if (postulacionActual) {
            estado = postulacionActual.estado;
        } else {
            estado = "DISPONIBLE";
        }

        return {
            id: candidato.id,
            codigo: candidato.codigo,

            nombreEstudiante: [
                candidato.Usuario?.nombres,
                candidato.Usuario?.apellidos
            ]
                .filter(Boolean)
                .join(" ") || "Sin información",

            correo: candidato.Usuario?.correo ?? "Sin información",

            estado,

            empresa: empresa?.nombre ?? "Sin asignar",
            vacante: vacante?.nombre ?? "Sin asignar",

            grupo: grupos.length
                ? grupos.map((grupo) => grupo.nombre).join(", ")
                : "Sin grupo"
        };
    });
};
