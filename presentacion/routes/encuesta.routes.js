import { Router } from "express";


import {

    crearEncuestaController,

    getEncuestasController,

    getEncuestaController,

    actualizarEncuestaController,

    actualizarPeriodoPlantillaController,

    eliminarEncuestaController

} from "../controllers/encuestaController.js";


const router = Router();


// =============================
// CREAR ENCUESTA COMPLETA
// =============================
// Crea:
// - PlantillaEncuesta
// - PeriodoPlantilla
// - Preguntas
// - Opciones

router.post(
    "/crear",
    crearEncuestaController
);


// =============================
// CONSULTAR TODAS LAS ENCUESTAS
// =============================

router.get(
    "/all",
    getEncuestasController
);


// =============================
// CONSULTAR UNA ENCUESTA
// =============================
// Incluye:
// - Rol
// - Periodos
// - Preguntas
// - Opciones
// - Aplicaciones
// - Respuestas

router.get(
    "/:id",
    getEncuestaController
);


// =============================
// ACTUALIZAR PLANTILLA
// =============================
// Actualiza:
// - Titulo
// - Descripcion
// - Rol

router.put(
    "/:id",
    actualizarEncuestaController
);


// =============================
// ACTUALIZAR VERSION / PERIODO
// =============================
// Actualiza:
// - Version
// - Preguntas
// - Opciones

router.put(
    "/periodo/:id",
    actualizarPeriodoPlantillaController
);


// =============================
// ELIMINAR ENCUESTA
// =============================

router.delete(
    "/:id",
    eliminarEncuestaController
);


export default router;