import { Router } from "express";

import {
    CrearPracticaController,
    eliminarPracticaController,
    obtenerPracticasController,
    obtenerPracticaPorIdController,
    obtenerPracticaPorPeriodoController,
    actualizarPracticaController
} from "../controllers/practicaController.js";


const router = Router();


router.get(
    "/all",
    obtenerPracticasController
);


router.post(
    "/crear",
    CrearPracticaController
);


router.delete(
    "/:id",
    eliminarPracticaController
);


router.get(
    "/:id",
    obtenerPracticaPorIdController
);


router.get(
    "/periodo/:periodo_id",
    obtenerPracticaPorPeriodoController
);


router.put(
    "/:id",
    actualizarPracticaController
);


export default router;