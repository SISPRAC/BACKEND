import { Router } from "express";

import {
    getConveniosController,
    getConvenioController,
    getConvenioByEmpresaController,
    getConveniosByEmpresaController,
    subirConvenioController,
    actualizarEstadoConvenioController
} from "../controllers/convenioController.js";

import { upload } from "../middleware/uploadMulter.js";

const router = Router();


// Obtener todos los convenios
router.get(
    "/all",
    getConveniosController
);


// Obtener todos los convenios de una empresa
router.get(
    "/empresa/:empresa_id/todos",
    getConveniosByEmpresaController
);


// Obtener el convenio de una empresa
router.get(
    "/empresa/:empresa_id",
    getConvenioByEmpresaController
);


// Obtener convenio por ID
router.get(
    "/:id",
    getConvenioController
);


// Subir / crear / actualizar convenio
router.post(
    "/",
    upload.single("archivo"),
    subirConvenioController
);


// Actualizar estado del convenio
router.put(
    "/:id/estado",
    actualizarEstadoConvenioController
);


export default router;