
import { Router } from "express";

import {
    crearEncuestaController,
    asignarEncuestaPracticaController,
    getEncuestasController,
    getEncuestaController,
    actualizarEncuestaController,
    eliminarEncuestaController,
    obtenerEncuestasEvaluacionPracticanteController,
    obtenerEncuestasPracticanteController,
    responderEncuestaEvaluacionPracticanteController,
    responderEncuestaPracticanteController,
    obtenerRespuestasEncuestasPracticanteController
} from "../controllers/encuestaController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();

// =============================
// CREAR ENCUESTA
// Solo Director de Programa
// =============================

router.post(
    "/crear",
    verifyToken,
    verifyRole(["Director de programa"]),
    crearEncuestaController
);

// =============================
// ASIGNAR ENCUESTA A PRÁCTICA
// Solo Director de Programa
// =============================

router.post(
    "/asignar-practica",
    verifyToken,
    verifyRole(["Director de programa"]),
    asignarEncuestaPracticaController
);

// =============================
// CONSULTAR TODAS LAS ENCUESTAS
// Solo Director de Programa
// =============================

router.get(
    "/all",
    verifyToken,
    verifyRole(["Director de programa"]),
    getEncuestasController
);

// =============================
// ENCUESTAS DEL PRACTICANTE
// Solo Practicante
// =============================

router.get(
    "/practicante",
    verifyToken,
    verifyRole(["Practicante"]),
    obtenerEncuestasPracticanteController
);

// =============================
// RESPUESTAS DE ENCUESTAS DEL PRACTICANTE
// Solo Director de Programa
// Incluye prácticas en curso y finalizadas
// =============================

router.get(
    "/practicante/:practicante_id/respuestas",
    verifyToken,
    verifyRole(["Director de programa"]),
    obtenerRespuestasEncuestasPracticanteController
);

// =============================
// ENCUESTAS PARA EVALUAR
// Tutor Docente, Tutor Empresarial o Empresa
// =============================

router.get(
    "/evaluacion/:practicante_id/:rolEvaluador",
    verifyToken,
    verifyRole([
        "Tutor Docente",
        "Tutor Empresarial",
        "Empresa"
    ]),
    obtenerEncuestasEvaluacionPracticanteController
);

// =============================
// RESPONDER ENCUESTA DE EVALUACIÓN
// Tutor Docente, Tutor Empresarial o Empresa
// =============================

router.post(
    "/responder-evaluacion",
    verifyToken,
    verifyRole([
        "Tutor Docente",
        "Tutor Empresarial",
        "Empresa"
    ]),
    responderEncuestaEvaluacionPracticanteController
);

// =============================
// RESPONDER ENCUESTA DEL PRACTICANTE
// Solo Practicante
// =============================

router.post(
    "/responder-practicante",
    verifyToken,
    verifyRole(["Practicante"]),
    responderEncuestaPracticanteController
);

// =============================
// CONSULTAR UNA ENCUESTA
// Solo Director de Programa
// =============================

router.get(
    "/:id",
    verifyToken,
    verifyRole(["Director de programa"]),
    getEncuestaController
);

// =============================
// ACTUALIZAR ENCUESTA
// Solo Director de Programa
// =============================

router.put(
    "/:id",
    verifyToken,
    verifyRole(["Director de programa"]),
    actualizarEncuestaController
);

// =============================
// ELIMINAR ENCUESTA
// Solo Director de Programa
// =============================

router.delete(
    "/:id",
    verifyToken,
    verifyRole(["Director de programa"]),
    eliminarEncuestaController
);

export default router;
