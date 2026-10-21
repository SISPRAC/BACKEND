
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const getPracticantesDocumentosByGrupo = async (
    { grupoRepository, practicaRequisitoDocumentoSubidoRepository },
    id
) => {
    const grupo =
        await grupoRepository.findGrupoDocumentosById(id);

    if (!grupo) {
        throw new BadRequestError("Grupo no encontrado");
    }

    const grupoCandidatos =
        await grupoRepository.findPracticantesDocumentosByGrupoId(id);

    const practicaId = grupo.practica_id;

    const requisitos =
        grupo.practica?.requisitosDocumentos ?? [];

    const totalRequisitos = requisitos.length;

    const requisitosIds = new Set(
        requisitos.map(requisito => Number(requisito.id))
    );

    const practicantes = [];

    for (const grupoCandidato of grupoCandidatos) {
        const candidato = grupoCandidato.candidato;
        const usuario = candidato?.Usuario;
        const practicante = candidato?.practicante;

        if (!candidato || !usuario || !practicante) {
            continue;
        }

        const practicaPracticante =
            practicante.practicas?.find(
                practica =>
                    Number(practica.practica_id) === Number(practicaId)
            );

        if (!practicaPracticante) {
            continue;
        }

        // Consultar los documentos usando el repositorio que ya funciona.
        const documentosSubidos =
            await practicaRequisitoDocumentoSubidoRepository
                .findByUsuarioYPractica(usuario.id, practicaId);

        // Contar requisitos distintos que tienen documento subido.
        const requisitosPresentados = new Set(
            documentosSubidos
                .map(documento =>
                    Number(documento.practicaRequisitoDocumento?.id)
                )
                .filter(requisitoId =>
                    requisitosIds.has(requisitoId)
                )
        );

        practicantes.push({
            id: practicante.id,
            candidato_id: candidato.id,
            usuario_id: usuario.id,
            codigo: candidato.codigo,
            nombre:
                `${usuario.nombres ?? ""} ${usuario.apellidos ?? ""}`.trim(),
            estado: practicaPracticante.estado,
            documentosPresentados: requisitosPresentados.size,
            totalDocumentos: totalRequisitos,
        });
    }

    return {
        grupo: {
            id: grupo.id,
            nombre: grupo.nombre,
            practica_id: practicaId,
        },
        totalRequisitos,
        practicantes,
    };
};
