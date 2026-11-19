import { Router } from "express";

import {
    getConveniosController,
    getConvenioController,
    getConvenioByEmpresaController,
    getConveniosByEmpresaController,
    subirConvenioController,
    actualizarEstadoConvenioController,
    aprobarConvenioController
} from "../controllers/convenioController.js";

import { upload } from "../middleware/uploadMulter.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


// Obtener todos los convenios
router.get(
    "/all",
    verifyToken,
    getConveniosController
);


// Obtener todos los convenios de una empresa
router.get(
    "/empresa/:empresa_id/todos",
    verifyToken,
    getConveniosByEmpresaController
);


// Obtener el convenio de una empresa
router.get(
    "/empresa/:empresa_id",
    verifyToken,
    getConvenioByEmpresaController
);


// Obtener convenio por ID
router.get(
    "/:id",
    verifyToken,
    getConvenioController
);


// Subir / crear / actualizar convenio
router.post(
    "/",
    verifyToken,
    upload.single("archivo"),
    subirConvenioController
);


// Actualizar estado del convenio
router.put(
    "/:id/estado",
    verifyToken,
    actualizarEstadoConvenioController
);

router.put(
    "/:id/aprobar",
    verifyToken,
    verifyRole(["Director de programa"]),
    upload.single("archivo"),
    aprobarConvenioController
);


export default router;