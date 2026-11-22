import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

// Orden en que aparecen las encuestas de un mismo practicante
const ORDEN_TIPO = {
    "Practicante": 1,
    "Tutor Docente": 2,
    "Tutor Empresarial": 3,
    "Empresa": 3,
};

const aPlano = (registro) =>
    registro?.toJSON ? registro.toJSON() : registro;

const nombreCompleto = (usuario) =>
    [usuario?.nombres, usuario?.apellidos].filter(Boolean).join(" ");

export const obtenerEncuestasParaReportePorPeriodo = async (
    { respuestaEncuestaRepository },
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

    const registros =
        await respuestaEncuestaRepository.findAllParaReportePorPeriodo(
            periodoId
        );

    const filas = registros.map((registro) => {
        const r = aPlano(registro);

        const plantilla = r.practicaEncuesta?.plantilla;
        const rolPlantilla =
            (plantilla?.Role ?? plantilla?.Rol ?? plantilla?.Roles)?.nombre ??
            "Sin rol";

        const candidato = r.practicante?.candidato;
        const usuarioPracticante = candidato?.Usuario;

        // Quien respondió (puede ser la Empresa en la encuesta de tutor empresarial)
        const quienResponde = r.usuario;
        const empresa = quienResponde?.Empresa ?? quienResponde?.Empresas;
        const respondioEmpresa = Boolean(empresa);

        // Las opciones múltiples vienen en varias filas: se agrupan por pregunta
        const porPregunta = new Map();

        const respuestasPregunta =
            r.RespuestaPreguntas ?? r.RespuestaPregunta ?? [];

        respuestasPregunta.forEach((rp) => {
            const pregunta = rp.Pregunta ?? rp.Preguntum ?? {};

            if (!porPregunta.has(rp.pregunta_id)) {
                porPregunta.set(rp.pregunta_id, {
                    pregunta_id: rp.pregunta_id,
                    orden: pregunta.orden ?? 0,
                    tipo: pregunta.tipo ?? "opcion_unica",
                    pregunta: pregunta.texto ?? "Pregunta sin texto",
                    valores: [],
                });
            }

            porPregunta.get(rp.pregunta_id).valores.push(rp.respuesta);
        });

        const respuestas = [...porPregunta.values()]
            .sort((a, b) => a.orden - b.orden)
            .map((p, indice) => ({
                numero: indice + 1,
                pregunta_id: p.pregunta_id,
                tipo: p.tipo,
                pregunta: p.pregunta,
                respuesta: p.valores.join(", "),
            }));

        return {
            id: r.id,
            practicanteId: r.practicante_id,
            codigo: candidato?.codigo ?? "Sin código",
            cedula: usuarioPracticante?.cedula ?? "Sin información",
            nombreEstudiante:
                nombreCompleto(usuarioPracticante) || "Sin información",

            encuestaId: plantilla?.id ?? null,
            encuesta: plantilla?.titulo ?? "Encuesta sin título",
            tipoEncuesta: rolPlantilla,

            respondidoPor: nombreCompleto(quienResponde) || "Sin información",
            respondioEmpresa,
            empresa: empresa?.nombre ?? null,

            fecha: r.fecha,
            respuestas,
        };
    });

    // Por practicante (A-Z) y, dentro de cada uno, Practicante → Tutor docente → Tutor empresarial
    return filas.sort((a, b) => {
        const porNombre = a.nombreEstudiante.localeCompare(
            b.nombreEstudiante,
            "es"
        );
        if (porNombre !== 0) return porNombre;

        return (
            (ORDEN_TIPO[a.tipoEncuesta] ?? 99) -
            (ORDEN_TIPO[b.tipoEncuesta] ?? 99)
        );
    });
};
