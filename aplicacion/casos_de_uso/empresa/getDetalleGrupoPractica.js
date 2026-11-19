import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerDetalleGrupoEmpresa = async (
    empresaRepository,
    practicaRepository,
    aperturaVacanteRepository,
    practicaPracticanteRepository,
    usuarioId,
    practicaId
) => {

    // 1. Empresa del usuario autenticado
    const empresa = await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError("No se encontró una empresa asociada al usuario");
    }

    // 2. Práctica
    const practica = await practicaRepository.findByIdConPeriodo(practicaId);

    if (!practica) {
        throw new NotFoundError("No se encontró la práctica");
    }

    // 3. Aperturas de la empresa en esta práctica
    const aperturas = await aperturaVacanteRepository
        .findByPracticaAndEmpresa(practicaId, empresa.id);

    // 4. Postulaciones aceptadas de la empresa (definen sus practicantes)
    const postulacionesAceptadas = await practicaPracticanteRepository
        .findPostulacionesAceptadasByPracticaAndEmpresa(practicaId, empresa.id);

    const candidatoIds = postulacionesAceptadas.map((p) => p.candidato_id);

    const postulacionPorCandidato = new Map(
        postulacionesAceptadas.map((p) => [p.candidato_id, p])
    );

    // 5. Practicantes de esos candidatos
    const practicaPracticantes = candidatoIds.length
        ? await practicaPracticanteRepository.findByPracticaAndCandidatos(
            practicaId,
            candidatoIds,
            ["En curso", "Finalizada", "Retirado", "Cancelado"]
        )
        : [];


    // 6. Formatear practicantes
    const practicantes = practicaPracticantes.map((registro) => {

        const practicante = registro.practicante;
        const candidato = practicante.candidato;
        const usuario = candidato.Usuario;
        const postulacion = postulacionPorCandidato.get(candidato.id);

        return {
            practica_practicante_id: registro.id,
            practicante_id: practicante.id,
            candidato_id: candidato.id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            tipo_documento: usuario.tipo_documento,
            cedula: usuario.cedula,
            telefono: usuario.telefono,
            estado: registro.estado,
            retiro: registro.retiro
                ? {
                    id: registro.retiro.id,
                    motivo: registro.retiro.motivo,
                    fecha_retiro: registro.retiro.fecha_retiro,
                    archivo: registro.retiro.archivoSoporte
                        ? {
                            nombre: registro.retiro.archivoSoporte.nombre,
                            url: registro.retiro.archivoSoporte.url
                        }
                        : null
                }
                : null,


            apertura: postulacion
                ? {
                    id: postulacion.AperturaVacante.id,
                    vacante: postulacion.AperturaVacante.Vacante.nombre
                }
                : null
        };
    });

    // 7. Formatear aperturas
    const aperturasFormateadas = aperturas.map((apertura) => ({
        id: apertura.id,
        vacante_id: apertura.vacante_id,
        practica_id: apertura.practica_id,
        tutorEmpresa_id: apertura.tutorEmpresa_id,
        vacante: apertura.Vacante.nombre,
        descripcion: apertura.Vacante.descripcion,
        cupos: apertura.cupos,
        estado: apertura.estado,
        tutor_empresarial: apertura.TutorEmpresa?.Usuario
            ? `${apertura.TutorEmpresa.Usuario.nombres} ${apertura.TutorEmpresa.Usuario.apellidos}`.trim()
            : null
    }));

    // 8. Respuesta final
    return {
        practica: {
            id: practica.id,
            periodo_id: practica.periodo_id,
            periodo: practica.Periodo.nombre,
            fecha_inicio: practica.fecha_inicio,
            fecha_fin: practica.fecha_fin,
            estado: practica.estado
        },
        practicantes,
        aperturas: aperturasFormateadas
    };

};