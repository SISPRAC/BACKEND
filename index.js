import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./infraestructura/database/dbConnection.js";
import authRouter from "./presentacion/routes/auth.routes.js";
import cors from "cors";
import cookieparser from "cookie-parser";
import userRouter from "./presentacion/routes/users.js";
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
import retiroPracticanteRouter from "./presentacion/routes/retiroPracticanteRoutes.js";
import practicanteRouter from "./presentacion/routes/practicante.routes.js";
import practicaRouter from "./presentacion/routes/practica.routes.js";
import practicaRequisitoDocumentoRouter from "./presentacion/routes/practicaRequisitoDocumento.routes.js";
import tutorEmpresarialRouter from "./presentacion/routes/tutorEmpresarial.routes.js"
import aperturaVacanteRouter from "./presentacion/routes/aperturaVacantes.routes.js";
import path from "path";
import { iniciarVencimientoConvenios } from "./infraestructura/jobs/vencerConveniosJob.js";


dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Cambia esto al dominio de tu frontend
  credentials: true,
}));

app.use(cookieparser());

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

app.use("/api/auth", authRouter);
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
app.use("/api/practicaRequisitoDocumento", practicaRequisitoDocumentoRouter);
app.use("/api/aperturaVacante", aperturaVacanteRouter);

iniciarVencimientoConvenios();

await initDB(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});

