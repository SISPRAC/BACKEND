import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./infraestructura/database/dbConnection.js";
import authRouter from "./presentacion/routes/auth.routes.js";
import cors from "cors";
import cookieparser from "cookie-parser";
import userRouter from "./presentacion/routes/users.routes.js";
import empresaRouter from "./presentacion/routes/empresa.routes.js"
import candidatoRouter from "./presentacion/routes/candidato.routes.js"
import staffRouter from "./presentacion/routes/tutores.routes.js"
import periodoRouter from "./presentacion/routes/periodo.routes.js"
import perfilRouter from "./presentacion/routes/perfil.routes.js"
import rolRouter from "./presentacion/routes/rol.routes.js";
import gruposRouter from "./presentacion/routes/grupos.routes.js";
import tutorDocenteRouter from "./presentacion/routes/tutorDocente.routes.js";
import vacanteRouter from "./presentacion/routes/vacante.routes.js";
import postulacionRouter from "./presentacion/routes/postulacion.routes.js"
import convenioRouter from "./presentacion/routes/convenios.routes.js";
import historialConvenioRouter from "./presentacion/routes/historialConvenio.routes.js";
import encuestaRouter from "./presentacion/routes/encuesta.routes.js";
import retiroPracticanteRouter from "./presentacion/routes/retiroPracticante.routes.js";
import practicanteRouter from "./presentacion/routes/practicante.routes.js";
import practicaRouter from "./presentacion/routes/practica.routes.js";
import practicaRequisitoDocumentoRouter from "./presentacion/routes/practicaRequisitoDocumento.routes.js";
import tutorEmpresarialRouter from "./presentacion/routes/tutorEmpresarial.routes.js"
import aperturaVacanteRouter from "./presentacion/routes/aperturaVacantes.routes.js";
import departamentoMunicipioRouter from "./presentacion/routes/departamentoMunicipio.routes.js"
import invitarRouter from "./presentacion/routes/invitacion.routes.js"
import tipoInformeRouter from "./presentacion/routes/tipoInforme.routes.js";
import practicaInformeRouter from "./presentacion/routes/practicaInforme.routes.js";
import tipoRequisitoDocumentoRouter from "./presentacion/routes/tipoRequisitoDocumento.routes.js";
import entregaInformeRouter from "./presentacion/routes/entregaInforme.routes.js";
import notificacionesRouter from "./presentacion/routes/notificaciones.routes.js";
import solicitudVisitaRouter from "./presentacion/routes/solicitudVisita.routes.js";
import visitaRouter from "./presentacion/routes/visita.routes.js";
import practicaRequisitoDocumentoSubidoRouter from "./presentacion/routes/practicaRequisitoDocumentoSubido.routes.js";
import reporteRouter from "./presentacion/routes/reportes.routes.js";
import habilidadBlandaRouter from "./presentacion/routes/habilidadBlanda.routes.js";
import idiomaRouter from "./presentacion/routes/idioma.routes.js";
import empresaRequisitoDocumentoRouter from "./presentacion/routes/empresaRequisitoDocumento.routes.js";
import periodoRespaldoRouter from "./presentacion/routes/periodoRespaldo.routes.js";

import { UPLOADS_ROOT } from "./infraestructura/external/storageService.js";
import { servirArchivoArchivado } from "./presentacion/middleware/archivosArchivadosMiddleware.js";
import { iniciarVencimientoConvenios } from "./infraestructura/jobs/vencerConveniosJob.js";
import { iniciarFinalizacionPracticas } from "./infraestructura/jobs/finalizarPracticas.js";
import { iniciarRespaldoPeriodos } from "./infraestructura/jobs/respaldarPeriodosJob.js";
import { iniciarRespaldoBaseDatos } from "./infraestructura/jobs/respaldoBaseDatosJob.js";



dotenv.config();
const app = express();
app.use(express.json());

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:8081",
  "https://frontend-sigma-blush-19.vercel.app"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
}));


app.use(cookieparser());

// Archivos ya movidos a Drive (sin copia local): se traen de Drive con la misma URL.
// Debe ir ANTES de express.static; si el archivo está en disco no hace nada.
app.use("/uploads", servirArchivoArchivado);

// Archivos subidos (documentos, logos, etc.), guardados en disco local.
app.use(
  "/uploads",
  express.static(UPLOADS_ROOT, {
    dotfiles: "deny",
    index: false,
    setHeaders: (res) => {
      // Evita que el navegador "adivine" el tipo y ejecute algo inesperado
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

app.use("/api/auth", authRouter);
app.use("/api/invitacion/", invitarRouter);
app.use("/api/empresa", empresaRouter);
app.use("/api/candidato", candidatoRouter);
app.use("/api/staff", staffRouter);
app.use("/api/users", userRouter);
app.use("/api/periodo", periodoRouter);
app.use("/api/perfil", perfilRouter);
app.use("/api/rol", rolRouter);
app.use("/api/grupo", gruposRouter);
app.use("/api/tutorDocente", tutorDocenteRouter);
app.use("/api/tutorEmpresarial", tutorEmpresarialRouter);
app.use("/api/vacante", vacanteRouter);
app.use("/api/postulacion", postulacionRouter);
app.use("/api/convenio", convenioRouter);
app.use("/api/historialConvenio", historialConvenioRouter);
app.use("/api/encuesta", encuestaRouter);
app.use("/api/retiroPracticante", retiroPracticanteRouter);
app.use("/api/practicante", practicanteRouter);
app.use("/api/practica", practicaRouter);
app.use("/api/tipoInforme", tipoInformeRouter);
app.use("/api/practicaInforme", practicaInformeRouter);
app.use("/api/tipoRequisitoDocumento", tipoRequisitoDocumentoRouter);
app.use("/api/entregaInforme", entregaInformeRouter);
app.use("/api/practicaRequisitoDocumento", practicaRequisitoDocumentoRouter);
app.use("/api/aperturaVacante", aperturaVacanteRouter);
app.use("/api/departamento/municipio", departamentoMunicipioRouter);
app.use("/api/notificaciones", notificacionesRouter);
app.use("/api/solicitudVisita", solicitudVisitaRouter);
app.use("/api/visita", visitaRouter);
app.use("/api/practicaRequisitoDocumentoSubido", practicaRequisitoDocumentoSubidoRouter);
app.use("/api/reportes", reporteRouter);
app.use("/api/habilidadesBlandas", habilidadBlandaRouter);
app.use("/api/idiomas", idiomaRouter);
app.use("/api/empresaRequisitoDocumento", empresaRequisitoDocumentoRouter);
app.use("/api/periodoRespaldo", periodoRespaldoRouter);

//await initDB(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS);
await initDB();
iniciarVencimientoConvenios();
iniciarFinalizacionPracticas();
iniciarRespaldoPeriodos();
iniciarRespaldoBaseDatos();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
