import { models } from "../../../infraestructura/database/dbConnection.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerDetalleGrupoEmpresa = async (
    usuarioId,
    practicaId
) => {

    // ==========================================
    // 1. OBTENER EMPRESA DEL USUARIO AUTENTICADO
    // ==========================================

    const empresa = await models.Empresa.findOne({
        where: {
            usuario_id: usuarioId
        }
    });

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró una empresa asociada al usuario"
        );
    }


    // ==========================================
    // 2. OBTENER LA PRÁCTICA
    // ==========================================

    const practica = await models.Practica.findByPk(
        practicaId,
        {
            include: [
                {
                    model: models.Periodo,
                    required: true
                }
            ]
        }
    );

    if (!practica) {
        throw new NotFoundError(
            "No se encontró la práctica"
        );
    }


    // ==========================================
    // 3. OBTENER APERTURAS DE LA EMPRESA
    // ==========================================

    const aperturas =
        await models.AperturaVacante.findAll({

            where: {
                practica_id: practicaId
            },

            include: [
                {
                    model: models.Vacante,
                    required: true,

                    include: [
                        {
                            model: models.Convenio,
                            required: true,

                            where: {
                                empresa_id: empresa.id
                            }
                        }
                    ]
                },
                {
                    model: models.TutorEmpresa,
                    required: false, // 👈 false por si alguna apertura no tiene tutor asignado aún

                    include: [
                        {
                            model: models.User,
                            required: true,

                            attributes: [
                                "nombres",
                                "apellidos"
                            ]
                        }
                    ]
                }
            ]

        });


    // ==========================================
    // 4. OBTENER PRACTICANTES DE LA EMPRESA
    // ==========================================

    const practicaPracticantes =
        await models.PracticaPracticante.findAll({
            where: {
                practica_id: practicaId,
                estado: ["En curso", "Finalizada"]
            },
            include: [
                {
                    model: models.Practicante,
                    as: "practicante",
                    required: true,
                    include: [
                        {
                            model: models.Candidato,
                            as: "candidato",
                            required: true,
                            include: [
                                {
                                    model: models.User,
                                    required: true,
                                    attributes: [
                                        "id", "nombres", "apellidos", "correo",
                                        "tipo_documento", "cedula", "telefono"
                                    ]
                                }
                                // 👈 ya NO incluimos Postulacion aquí
                            ]
                        }
                    ]
                }
            ]
        });


    // ==========================================
    // 4.5 OBTENER LA POSTULACIÓN ACEPTADA POR SEPARADO
    // ==========================================

    const candidatoIds = practicaPracticantes.map(
        (registro) => registro.practicante.candidato.id
    );

    const postulacionesAceptadas =
        await models.Postulacion.findAll({
            where: {
                candidato_id: candidatoIds,
                estado: "ACEPTADO"
            },
            include: [
                {
                    model: models.AperturaVacante,
                    required: true,
                    where: { practica_id: practicaId },
                    include: [
                        {
                            model: models.Vacante,
                            required: true
                            // ya no hace falta filtrar por Convenio/empresa aquí,
                            // porque solo consultamos practicantes de esta empresa
                        }
                    ]
                }
            ]
        });

    // mapa candidato_id -> postulación aceptada, para acceso O(1) en el .map()
    const postulacionPorCandidato = new Map(
        postulacionesAceptadas.map((p) => [p.candidato_id, p])
    );


    // ==========================================
    // 5. FORMATEAR PRACTICANTES
    // ==========================================


    const practicantes =
        practicaPracticantes.map((registro) => {

            const practicante = registro.practicante;
            const candidato = practicante.candidato;
            const usuario = candidato.Usuario;

            const postulacion =
                postulacionPorCandidato.get(candidato.id);

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

                apertura: postulacion
                    ? {
                        id: postulacion.AperturaVacante.id,
                        vacante: postulacion.AperturaVacante.Vacante.nombre // 👈 ahora sí funciona
                    }
                    : null
            };

        });


    // ==========================================
    // 6. FORMATEAR APERTURAS
    // ==========================================

    const aperturasFormateadas =
        aperturas.map((apertura) => ({

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


    // ==========================================
    // 7. RESPUESTA FINAL
    // ==========================================

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

        aperturas:
            aperturasFormateadas

    };

};