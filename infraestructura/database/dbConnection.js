import { Sequelize } from "sequelize";
import createUserModel from "../models/userModel.js";
import createRolModel from "../models/rolModel.js";
import createUserRolModel from "../models/userRolModel.js";
import createEmpresaModel from "../models/empresaModel.js";
import createCandidatoModel from "../models/candidatoModel.js";
import createPeriodoModel from "../models/periodoModel.js";
import createGrupoModel from "../models/grupoModel.js";
import createPerfilModel from "../models/perfilModel.js";
import createCandidatoPerfilModel from "../models/candidatoPerfilModel.js";
import createTutorDocenteModel from "../models/tutorDocenteModel.js";
import createVacanteModel from "../models/vacanteModel.js";
import createPostulacionModel from "../models/postulacionModel.js";
import createAperturaVacanteModel from "../models/aperturaVacanteModel.js";
import createTutorEmpresaModel from "../models/tutorEmpresaModel.js";
import createConvenioModel from "../models/convenioModel.js";
import createPerfilVacanteModel from "../models/perfilVacanteModel.js";
import createArchivoModel from "../models/archivoModel.js";
import createHistorialConvenioModel from "../models/historialConvenioModel.js";
import createPlantillaEncuestaModel from "../models/plantillaEncuestaModel.js";
import createPreguntaModel from "../models/preguntaModel.js";
import createRespuestaEncuestaModel from "../models/respuestaEncuestaModel.js";
import createRespuestaPreguntaModel from "../models/respuestaPreguntaModel.js";
import createOpcionPreguntaModel from "../models/opcionPreguntaModel.js";
import createRetiroPracticanteModel from "../models/retirarPracticanteModel.js";
import createPracticanteModel from "../models/practicanteModel.js";

import createEntregaInformeModel from "../models/entregaInformeModel.js";
import createPracticaModel from "../models/practicaModel.js";
import createPracticaPracticanteModel from "../models/practicaPracticanteModel.js";
import createPracticaEncuestaModel from "../models/practicaEncuestaModel.js";
import createSolicitudVisitaModel from "../models/solicitudVisitaModel.js";
import createFechaPropuestaVisitaModel from "../models/fechaPropuestaVisitaModel.js";
import createVisitaModel from "../models/visitaModel.js";
import createTipoRequisitoDocumentoModel from "../models/tipoRequisitoDocumentoModel.js";
import createVisitaArchivoModel from "../models/visitaArchivoModel.js";
import createPracticaRequisitoDocumentoModel from "../models/practicaRequisitoDocumentoModel.js";
import createGrupoCandidatoModel from "../models/grupoCandidatoModel.js";
import createHistorialAperturaVacanteModel
    from "../models/historialAperturaVacanteModel.js";
import createDepartamentoModel from "../models/departamentoModel.js";
import createMunicipioModel from "../models/municipiosModel.js";



let sequelize;
let models = {};

export const initDB = async (database, username, contraseña) => {
    sequelize = new Sequelize(database, username, contraseña, {
        host: 'localhost',
        dialect: 'postgres'
    });

    try {
        await sequelize.authenticate();

        models.User = createUserModel(sequelize);
        models.Rol = createRolModel(sequelize);

        models.UserRol = createUserRolModel(sequelize);
        models.TutorDocente = createTutorDocenteModel(sequelize);
        models.Empresa = createEmpresaModel(sequelize);
        models.Candidato = createCandidatoModel(sequelize);
        models.Periodo = createPeriodoModel(sequelize);
        models.Grupo = createGrupoModel(sequelize);
        models.GrupoCandidato = createGrupoCandidatoModel(sequelize);
        models.Perfil = createPerfilModel(sequelize);
        models.CandidatoPerfil = createCandidatoPerfilModel(sequelize);
        models.HistorialAperturaVacante = createHistorialAperturaVacanteModel(sequelize);
        models.Vacante = createVacanteModel(sequelize);
        models.Postulacion = createPostulacionModel(sequelize);
        models.AperturaVacante = createAperturaVacanteModel(sequelize);
        models.TutorEmpresa = createTutorEmpresaModel(sequelize);
        models.Convenio = createConvenioModel(sequelize);
        models.PerfilVacante = createPerfilVacanteModel(sequelize);
        models.Archivo = createArchivoModel(sequelize);
        models.HistorialConvenio = createHistorialConvenioModel(sequelize);

        models.PlantillaEncuesta = createPlantillaEncuestaModel(sequelize);
        models.Pregunta = createPreguntaModel(sequelize);
        models.RespuestaEncuesta = createRespuestaEncuestaModel(sequelize);
        models.RespuestaPregunta = createRespuestaPreguntaModel(sequelize);
        models.OpcionPregunta = createOpcionPreguntaModel(sequelize);
        models.RetiroPracticante = createRetiroPracticanteModel(sequelize);
        models.Practicante = createPracticanteModel(sequelize);

        models.TipoRequisitoDocumento = createTipoRequisitoDocumentoModel(sequelize);
        models.EntregaInforme = createEntregaInformeModel(sequelize);


        models.Practica = createPracticaModel(sequelize);
        models.PracticaPracticante = createPracticaPracticanteModel(sequelize);
        models.PracticaEncuesta = createPracticaEncuestaModel(sequelize);
        models.SolicitudVisita = createSolicitudVisitaModel(sequelize);
        models.FechaPropuestaVisita = createFechaPropuestaVisitaModel(sequelize);
        models.Visita = createVisitaModel(sequelize);
        models.VisitaArchivo = createVisitaArchivoModel(sequelize);
        models.PracticaRequisitoDocumento = createPracticaRequisitoDocumentoModel(sequelize);
        models.Departamento = createDepartamentoModel(sequelize);
        models.Municipio = createMunicipioModel(sequelize);


        models.User.belongsToMany(models.Rol, {
            through: models.UserRol,
            foreignKey: "user_id",
            otherKey: "role_id"
        });

        models.Rol.belongsToMany(models.User, {
            through: models.UserRol,
            foreignKey: "role_id",
            otherKey: "user_id"
        });

        models.User.hasMany(models.UserRol, {
            foreignKey: "user_id",
            as: "rolesAsignados",
        });

        models.UserRol.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "usuario",
        });

        models.Rol.hasMany(models.UserRol, {
            foreignKey: "role_id",
            as: "usuariosAsignados",
        });

        models.UserRol.belongsTo(models.Rol, {
            foreignKey: "role_id",
            as: "rol",
        });

        models.User.hasOne(models.Empresa, { foreignKey: "usuario_id" });
        models.Empresa.belongsTo(models.User, { foreignKey: "usuario_id" });

        models.User.hasOne(models.Candidato, { foreignKey: "usuario_id" });
        models.Candidato.belongsTo(models.User, { foreignKey: "usuario_id" });

        models.User.hasOne(models.TutorEmpresa, { foreignKey: "usuario_id" });
        models.TutorEmpresa.belongsTo(models.User, { foreignKey: "usuario_id" });

        models.User.hasOne(models.TutorDocente, { foreignKey: "usuario_id" });
        models.TutorDocente.belongsTo(models.User, { foreignKey: "usuario_id" });


        models.Candidato.belongsToMany(models.Perfil, {
            through: models.CandidatoPerfil,
            foreignKey: "candidato_id",
            otherKey: "perfil_id"
        });

        models.Perfil.belongsToMany(models.Candidato, {
            through: models.CandidatoPerfil,
            foreignKey: "perfil_id",
            otherKey: "candidato_id"
        });


        models.Candidato.belongsTo(models.Archivo, {
            foreignKey: "hoja_vida_archivo_id",
            as: "hojaVida"
        });

        models.Archivo.hasOne(models.Candidato, {
            foreignKey: "hoja_vida_archivo_id",
            as: "candidatoHojaVida"
        });

        models.Practica.belongsTo(models.Archivo, {
            foreignKey: "archivo_arl_id",
            as: "archivoArl"
        });

        models.Archivo.hasOne(models.Practica, {
            foreignKey: "archivo_arl_id",
            as: "practicaArl"
        });

        models.Practica.hasMany(models.Grupo, {
            foreignKey: "practica_id",
            as: "grupos"
        });

        models.Grupo.belongsTo(models.Practica, {
            foreignKey: "practica_id",
            as: "practica"
        });

        models.TutorDocente.hasMany(models.Grupo, {
            foreignKey: "tutorDocente_id"
        });

        models.Grupo.belongsTo(models.TutorDocente, {
            foreignKey: "tutorDocente_id"
        });

        models.Empresa.hasMany(models.TutorEmpresa, {
            foreignKey: "empresa_id"
        });
        models.TutorEmpresa.belongsTo(models.Empresa, {
            foreignKey: "empresa_id"
        });

        models.Empresa.hasMany(models.Convenio, {
            foreignKey: "empresa_id"
        });
        models.Convenio.belongsTo(models.Empresa, {
            foreignKey: "empresa_id"
        });

        models.Convenio.hasMany(models.Vacante, {
            foreignKey: "convenio_id"
        });
        models.Vacante.belongsTo(models.Convenio, {
            foreignKey: "convenio_id"
        });

        models.TutorEmpresa.hasMany(models.AperturaVacante, {
            foreignKey: "tutorEmpresa_id"
        });

        models.AperturaVacante.belongsTo(models.TutorEmpresa, {
            foreignKey: "tutorEmpresa_id"
        });

        models.Vacante.hasMany(models.AperturaVacante, {
            foreignKey: "vacante_id"
        });
        models.AperturaVacante.belongsTo(models.Vacante, {
            foreignKey: "vacante_id"
        });

        models.Practica.hasMany(models.AperturaVacante, {
            foreignKey: "practica_id",
            as: "aperturasVacante"
        });

        models.AperturaVacante.belongsTo(models.Practica, {
            foreignKey: "practica_id",
            as: "practica"
        });

        models.AperturaVacante.hasMany(models.HistorialAperturaVacante, {
            foreignKey: "apertura_vacante_id",
            as: "historialCupos"
        });

        models.HistorialAperturaVacante.belongsTo(models.AperturaVacante, {
            foreignKey: "apertura_vacante_id",
            as: "aperturaVacante"
        });



        models.Grupo.hasMany(models.GrupoCandidato, {
            foreignKey: "grupo_id",
            as: "candidatosAsignados"
        });

        models.GrupoCandidato.belongsTo(models.Grupo, {
            foreignKey: "grupo_id",
            as: "grupo"
        });

        models.Candidato.hasMany(models.GrupoCandidato, {
            foreignKey: "candidato_id",
            as: "gruposAsignados"
        });

        models.GrupoCandidato.belongsTo(models.Candidato, {
            foreignKey: "candidato_id",
            as: "candidato"
        });

        // Grupo <-> Candidato mediante GrupoCandidato

        models.Grupo.belongsToMany(models.Candidato, {
            through: models.GrupoCandidato,
            foreignKey: "grupo_id",
            otherKey: "candidato_id",
            as: "Candidatos"
        });

        models.Candidato.belongsToMany(models.Grupo, {
            through: models.GrupoCandidato,
            foreignKey: "candidato_id",
            otherKey: "grupo_id",
            as: "Grupos"
        });

        models.Candidato.hasMany(models.Postulacion, {
            foreignKey: "candidato_id"
        });
        models.Postulacion.belongsTo(models.Candidato, {
            foreignKey: "candidato_id"
        });

        models.AperturaVacante.hasMany(models.Postulacion, {
            foreignKey: "aperturaVacante_id"
        });
        models.Postulacion.belongsTo(models.AperturaVacante, {
            foreignKey: "aperturaVacante_id"
        });

        models.Vacante.belongsToMany(models.Perfil, {
            through: models.PerfilVacante,
            foreignKey: "vacante_id",
            otherKey: "perfil_id"
        });

        models.Perfil.belongsToMany(models.Vacante, {
            through: models.PerfilVacante,
            foreignKey: "perfil_id",
            otherKey: "vacante_id"
        });

        models.Candidato.hasMany(models.CandidatoPerfil, {
            foreignKey: "candidato_id"
        });
        models.CandidatoPerfil.belongsTo(models.Candidato, {
            foreignKey: "candidato_id"
        });

        models.Perfil.hasMany(models.CandidatoPerfil, {
            foreignKey: "perfil_id"
        });
        models.CandidatoPerfil.belongsTo(models.Perfil, {
            foreignKey: "perfil_id"
        });

        models.Convenio.belongsTo(models.Archivo, {
            foreignKey: "archivo_id"
        });


        models.Archivo.hasOne(models.Convenio, {
            foreignKey: "archivo_id"
        });

        models.Convenio.hasMany(models.HistorialConvenio, {
            foreignKey: "convenio_id"
        });

        models.HistorialConvenio.belongsTo(models.Convenio, {
            foreignKey: "convenio_id"
        });

        models.HistorialConvenio.belongsTo(models.Archivo, {
            foreignKey: "archivo_id"
        });

        models.Archivo.hasMany(models.HistorialConvenio, {
            foreignKey: "archivo_id"
        });

        models.User.hasMany(models.HistorialConvenio, {
            foreignKey: "usuario_id"
        });


        models.HistorialConvenio.belongsTo(models.User, {
            foreignKey: "usuario_id"
        });

        // =============================
        // ENCUESTAS / ENTREVISTAS
        // =============================

        // Rol -> Plantillas
        models.Rol.hasMany(models.PlantillaEncuesta, {
            foreignKey: "rol_id"
        });

        models.PlantillaEncuesta.belongsTo(models.Rol, {
            foreignKey: "rol_id"
        });


        // Plantilla -> Preguntas
        models.PlantillaEncuesta.hasMany(models.Pregunta, {
            foreignKey: "plantilla_encuesta_id",
            as: "preguntas",
            onDelete: "CASCADE"
        });

        models.Pregunta.belongsTo(models.PlantillaEncuesta, {
            foreignKey: "plantilla_encuesta_id",
            as: "plantilla"
        });


        // Practica -> PracticaEncuesta
        models.Practica.hasMany(models.PracticaEncuesta, {
            foreignKey: "practica_id",
            as: "encuestas"
        });

        models.PracticaEncuesta.belongsTo(models.Practica, {
            foreignKey: "practica_id",
            as: "practica"
        });


        // Plantilla -> PracticaEncuesta
        models.PlantillaEncuesta.hasMany(models.PracticaEncuesta, {
            foreignKey: "plantilla_encuesta_id",
            as: "practicas"
        });

        models.PracticaEncuesta.belongsTo(models.PlantillaEncuesta, {
            foreignKey: "plantilla_encuesta_id",
            as: "plantilla"
        });


        // Usuario -> RespuestaEncuesta
        models.User.hasMany(models.RespuestaEncuesta, {
            foreignKey: "usuario_id",
            as: "respuestasEncuestas"
        });

        models.RespuestaEncuesta.belongsTo(models.User, {
            foreignKey: "usuario_id",
            as: "usuario"
        });


        // PracticaEncuesta -> RespuestaEncuesta
        models.PracticaEncuesta.hasMany(models.RespuestaEncuesta, {
            foreignKey: "practica_encuesta_id",
            as: "respuestas"
        });

        models.RespuestaEncuesta.belongsTo(models.PracticaEncuesta, {
            foreignKey: "practica_encuesta_id",
            as: "practicaEncuesta"
        });


        // RespuestaEncuesta -> RespuestaPregunta
        models.RespuestaEncuesta.hasMany(models.RespuestaPregunta, {
            foreignKey: "respuesta_encuesta_id"
        });

        models.RespuestaPregunta.belongsTo(models.RespuestaEncuesta, {
            foreignKey: "respuesta_encuesta_id"
        });


        // Pregunta -> RespuestaPregunta
        models.Pregunta.hasMany(models.RespuestaPregunta, {
            foreignKey: "pregunta_id",
            onDelete: "RESTRICT"
        });

        models.RespuestaPregunta.belongsTo(models.Pregunta, {
            foreignKey: "pregunta_id"
        });


        // Pregunta -> OpcionPregunta
        models.Pregunta.hasMany(models.OpcionPregunta, {
            foreignKey: "pregunta_id",
            onDelete: "CASCADE"
        });

        models.OpcionPregunta.belongsTo(models.Pregunta, {
            foreignKey: "pregunta_id"
        });


        models.RetiroPracticante.belongsTo(models.User, {
            foreignKey: "usuario_id",
            as: "usuario",
        });


        // Relación entre RetiroPracticante y Practicante

        models.User.hasMany(models.RetiroPracticante, {
            foreignKey: "usuario_id",
            as: "retirosRealizados",
        });

        models.RetiroPracticante.belongsTo(models.Archivo, {
            foreignKey: "archivo_id",
            as: "archivoSoporte",
        });

        models.Archivo.hasMany(models.RetiroPracticante, {
            foreignKey: "archivo_id",
            as: "retiros",
        });

        models.Practicante.belongsTo(models.Candidato, {
            foreignKey: "candidato_id",
            as: "candidato",
            onDelete: "CASCADE"
        });

        models.Candidato.hasOne(models.Practicante, {
            foreignKey: "candidato_id",
            as: "practicante",
            onDelete: "CASCADE"
        });

        //practica y practicante

        models.Practica.hasMany(models.PracticaPracticante, {
            foreignKey: "practica_id",
            as: "practicantes",
        });

        models.PracticaPracticante.belongsTo(models.Practica, {
            foreignKey: "practica_id",
            as: "practica",
        });

        models.Practicante.hasMany(models.PracticaPracticante, {
            foreignKey: "practicante_id",
            as: "practicas",
        });

        models.PracticaPracticante.belongsTo(models.Practicante, {
            foreignKey: "practicante_id",
            as: "practicante",
        });


        models.PracticaPracticante.hasMany(models.SolicitudVisita, {
            foreignKey: "practica_practicante_id",
            as: "solicitudesVisita",
        });

        models.SolicitudVisita.belongsTo(models.PracticaPracticante, {
            foreignKey: "practica_practicante_id",
            as: "practicaPracticante",
        });

        models.TutorDocente.hasMany(models.SolicitudVisita, {
            foreignKey: "tutor_docente_id",
            as: "solicitudesCreadas",
        });

        models.SolicitudVisita.belongsTo(models.TutorDocente, {
            foreignKey: "tutor_docente_id",
            as: "tutorDocente",
        });

        models.User.hasMany(models.SolicitudVisita, {
            foreignKey: "usuario_respuesta_id",
            as: "solicitudesRespondidas",
        });

        models.SolicitudVisita.belongsTo(models.User, {
            foreignKey: "usuario_respuesta_id",
            as: "usuarioRespuesta",
        });

        models.SolicitudVisita.hasMany(models.FechaPropuestaVisita, {
            foreignKey: "solicitud_visita_id",
            as: "fechasPropuestas",
        });

        models.FechaPropuestaVisita.belongsTo(models.SolicitudVisita, {
            foreignKey: "solicitud_visita_id",
            as: "solicitud",
        });

        models.User.hasMany(models.FechaPropuestaVisita, {
            foreignKey: "usuario_propone_id",
            as: "fechasPropuestas",
        });

        models.FechaPropuestaVisita.belongsTo(models.User, {
            foreignKey: "usuario_propone_id",
            as: "usuarioPropone",
        });

        //solicitud Visita

        models.SolicitudVisita.hasOne(models.Visita, {
            foreignKey: "solicitud_visita_id",
            as: "visita",
        });

        models.Visita.belongsTo(models.SolicitudVisita, {
            foreignKey: "solicitud_visita_id",
            as: "solicitud",
        });

        models.Visita.hasMany(models.VisitaArchivo, {
            foreignKey: "visita_id",
            as: "evidencias",
        });

        models.VisitaArchivo.belongsTo(models.Visita, {
            foreignKey: "visita_id",
            as: "visita",
        });

        models.Archivo.hasMany(models.VisitaArchivo, {
            foreignKey: "archivo_id",
            as: "visitas",
        });

        models.VisitaArchivo.belongsTo(models.Archivo, {
            foreignKey: "archivo_id",
            as: "archivo",
        });



        models.PracticaPracticante.hasMany(models.EntregaInforme, {
            foreignKey: "practica_practicante_id",
            as: "entregasInformes"
        });

        models.EntregaInforme.belongsTo(models.PracticaPracticante, {
            foreignKey: "practica_practicante_id",
            as: "practicaPracticante"
        });

        models.Archivo.hasMany(models.EntregaInforme, {
            foreignKey: "archivo_id",
            as: "entregasInformes"
        });

        models.EntregaInforme.belongsTo(models.Archivo, {
            foreignKey: "archivo_id",
            as: "archivo"
        });


        models.PracticaRequisitoDocumento.hasMany(models.EntregaInforme, {
            foreignKey: "practica_requisito_documento_id",
            as: "entregasInformes"
        });

        models.EntregaInforme.belongsTo(models.PracticaRequisitoDocumento, {
            foreignKey: "practica_requisito_documento_id",
            as: "practicaRequisitoDocumento"
        });

        models.Rol.hasMany(models.TipoRequisitoDocumento, {
            foreignKey: "rol_id",
            as: "tiposRequisitoDocumento"
        });

        models.TipoRequisitoDocumento.belongsTo(models.Rol, {
            foreignKey: "rol_id",
            as: "rol"
        });

        models.TipoRequisitoDocumento.hasMany(models.PracticaRequisitoDocumento, {
            foreignKey: "tipo_requisito_documento_id",
            as: "practicasRequisito"
        });

        models.PracticaRequisitoDocumento.belongsTo(models.TipoRequisitoDocumento, {
            foreignKey: "tipo_requisito_documento_id",
            as: "tipoRequisitoDocumento"
        });

        models.Archivo.hasMany(models.TipoRequisitoDocumento, {
            foreignKey: "archivo_id",
            as: "tiposRequisitoDocumento"
        });

        models.TipoRequisitoDocumento.belongsTo(models.Archivo, {
            foreignKey: "archivo_id",
            as: "plantilla"
        });

        models.TutorDocente.hasMany(models.EntregaInforme, {
            foreignKey: "tutor_docente_id",
            as: "entregasInformes"
        });

        models.EntregaInforme.belongsTo(models.TutorDocente, {
            foreignKey: "tutor_docente_id",
            as: "tutorDocente"
        });

        models.TutorEmpresa.hasMany(models.EntregaInforme, {
            foreignKey: "tutor_empresarial_id",
            as: "entregasInformes"
        });

        models.EntregaInforme.belongsTo(models.TutorEmpresa, {
            foreignKey: "tutor_empresarial_id",
            as: "tutorEmpresarial"
        });



        models.Departamento.hasMany(
            models.Municipio,
            {
                foreignKey: "departamento_id",
                as: "municipios"
            }
        );

        models.Municipio.belongsTo(
            models.Departamento,
            {
                foreignKey: "departamento_id",
                as: "departamentos"
            }
        );

        models.Departamento.hasMany(models.Practicante, {
            foreignKey: "codigoDepResidencia",
            sourceKey: "codigo",
            as: "practicantes",
        });

        models.Practicante.belongsTo(models.Departamento, {
            foreignKey: "codigoDepResidencia",
            targetKey: "codigo",
            as: "departamentoResidencia",
        });


        models.Municipio.hasMany(models.Practicante, {
            foreignKey: "codigoMunResidencia",
            sourceKey: "codigo",
            as: "practicantes",
        });

        models.Practicante.belongsTo(models.Municipio, {
            foreignKey: "codigoMunResidencia",
            targetKey: "codigo",
            as: "municipioResidencia",
        });



        // =============================
        // PERIODO -> PRACTICA
        // =============================

        models.Periodo.hasOne(models.Practica, {
            foreignKey: "periodo_id"
        });

        models.Practica.belongsTo(models.Periodo, {
            foreignKey: "periodo_id"
        });


        models.Practica.hasMany(models.PracticaRequisitoDocumento, {
            foreignKey: "practica_id",
            as: "requisitosDocumentos"
        });

        models.PracticaRequisitoDocumento.belongsTo(models.Practica, {
            foreignKey: "practica_id",
            as: "practica"
        });



        await sequelize.sync({ alter: true });

        console.log('DB connected');
    } catch (error) {
        console.error('DB error:', error);
    }
};

export { sequelize, models };