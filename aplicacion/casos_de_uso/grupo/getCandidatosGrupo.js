
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getCandidatosGrupo = async (
    grupoRepository,
    id
) => {

    const grupo =
        await grupoRepository.findCandidatosByGrupoId(id);

    if (!grupo) {
        throw new BadRequestError(
            "Grupo no encontrado"
        );
    }

    console.log(
        "GRUPOS CANDIDATOS:",
        grupo.candidatosAsignados?.map(gc => ({
            grupo_candidato_id: gc.id,
            grupo_id: gc.grupo_id,
            candidato_id: gc.candidato_id,
            candidato: gc.candidato?.toJSON() || null
        }))
    );

    const tutor = grupo.TutorDocente;
    const usuarioTutor = tutor?.Usuario;

    // ==========================================
    // OBTENER LOS CANDIDATOS ASIGNADOS AL GRUPO
    // ==========================================

    const candidatoIds = (grupo.candidatosAsignados || [])
        .map((gc) => gc.candidato_id);

    console.log("PRACTICA ID:", grupo.practica_id);
    console.log("CANDIDATOS DEL GRUPO:", candidatoIds);

    // ==========================================
    // OBTENER SEGUIMIENTO DE LOS PRACTICANTES
    // ==========================================

    const practicaPracticantes = candidatoIds.length
        ? await grupoRepository.findPracticaPracticantesByPracticaAndCandidatos(
            grupo.practica_id,
            candidatoIds
        )
        : [];

    const practicaPracticantePorCandidato = new Map(
        practicaPracticantes
            .filter((pp) => pp.practicante)
            .map((pp) => [
                pp.practicante.candidato_id,
                pp
            ])
    );

    console.log(
        "MAPA PRACTICANTES:",
        [...practicaPracticantePorCandidato.entries()]
    );

    // ==========================================
    // RESPUESTA
    // ==========================================

    return {
        id: grupo.id,
        nombre: grupo.nombre,

        practica_id: grupo.practica_id,
        practica: grupo.practica,

        tutorDocente_id: grupo.tutorDocente_id,

        tutorDocente: tutor
            ? {
                id: tutor.id,
                codigo: tutor.codigo,
                nombre: `${usuarioTutor?.nombres || ""} ${usuarioTutor?.apellidos || ""}`.trim()
            }
            : null,

        candidatos:
            grupo.candidatosAsignados?.map(
                (grupoCandidato) => {

                    const candidato =
                        grupoCandidato.candidato;

                    const usuario =
                        candidato?.Usuario;

                    const postulacion =
                        candidato?.Postulacions?.[0];

                    const apertura =
                        postulacion?.AperturaVacante;

                    const vacante =
                        apertura?.Vacante;

                    const convenio =
                        vacante?.Convenio;

                    const empresa =
                        convenio?.Empresa;

                    // ==========================================
                    // ESTADO INDIVIDUAL DEL PRACTICANTE
                    // ==========================================

                    const practicaPracticante =
                        practicaPracticantePorCandidato.get(candidato?.id);

                    let estado = "Disponible";

                    if (practicaPracticante) {

                        estado = practicaPracticante.estado;

                    } else if (
                        postulacion?.estado === "POSTULADO"
                    ) {

                        estado = "POSTULADO";
                    }

                    return {
                        // ID DEL CANDIDATO
                        id: candidato?.id,

                        // ID DEL PRACTICANTE PARA LAS ACCIONES
                        practicante_id: candidato?.practicante?.id || null,

                        codigo: candidato?.codigo,

                        correo: usuario?.correo || null,

                        nombre:
                            `${usuario?.nombres || ""} ${usuario?.apellidos || ""}`.trim(),

                        empresa:
                            empresa?.nombre || null,

                        estado,

                        practica_practicante_id:
                            practicaPracticante?.id || null,

                        retiro: practicaPracticante?.retiro
                            ? {
                                id: practicaPracticante.retiro.id,
                                archivo_id: practicaPracticante.retiro.archivo_id,
                                motivo: practicaPracticante.retiro.motivo,
                                fecha_retiro: practicaPracticante.retiro.fecha_retiro,

                                archivo: practicaPracticante.retiro.archivoSoporte
                                    ? {
                                        nombre: practicaPracticante.retiro.archivoSoporte.nombre,
                                        url: practicaPracticante.retiro.archivoSoporte.url
                                    }
                                    : null
                            }
                            : null,

                        certificado: practicaPracticante?.certificadoArchivo
                            ? {
                                id: practicaPracticante.certificadoArchivo.id,
                                subido_por: practicaPracticante.certificado_subido_por,
                                fecha_subida: practicaPracticante.certificado_fecha_subida,

                                archivo: {
                                    nombre: practicaPracticante.certificadoArchivo.nombre,
                                    url: practicaPracticante.certificadoArchivo.url
                                }
                            }
                            : null
                    };
                }
            ) || []
    };
};
