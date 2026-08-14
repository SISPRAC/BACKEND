import { Router } from "express";

import {

    crearEncuestaController,

    asignarEncuestaPracticaController,

    getEncuestasController,

    getEncuestaController,

    actualizarEncuestaController,

    eliminarEncuestaController

} from "../controllers/encuestaController.js";


const router = Router();


// =============================
// CREAR ENCUESTA
// =============================
// Crea:
// - PlantillaEncuesta

router.post(
    "/crear",
    crearEncuestaController
);


// =============================
// ASIGNAR ENCUESTA A PRÁCTICA
// =============================
// Crea:
// - PracticaEncuesta

router.post(
    "/asignar-practica",
    asignarEncuestaPracticaController
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

router.get(
    "/:id",
    getEncuestaController
);


// =============================
// ACTUALIZAR ENCUESTA
// =============================
// Actualiza:
// - Título
// - Descripción
// - Preguntas
// - Opciones
//
// No permite modificar una plantilla
// que ya haya sido utilizada en una práctica.

router.put(
    "/:id",
    actualizarEncuestaController
);


// =============================
// ELIMINAR ENCUESTA
// =============================

router.delete(
    "/:id",
    eliminarEncuestaController
);


export default router;