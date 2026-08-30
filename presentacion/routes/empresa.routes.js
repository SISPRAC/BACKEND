import { Router } from "express";

import {
    registerEmpresaController,
    actualizarEmpresaController,
    obtenerEmpresaController,
    obtenerGruposEmpresaController,
    obtenerDetalleGrupoEmpresaController
} from "../controllers/empresaController.js";

import { uploadImage } from "../middleware/uploadMulter.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
    "/registrarEmpresa",
    uploadImage.single("logo"),
    verifyToken,
    registerEmpresaController
);

router.get(
    "/mi-empresa",
    verifyToken,
    obtenerEmpresaController
);

router.put(
    "/:id",
    uploadImage.single("logo"),
    verifyToken,
    actualizarEmpresaController
);

router.get(
    "/mis-grupos",
    verifyToken,
    obtenerGruposEmpresaController
);

router.get(
    "/mis-grupos/:practicaId",
    verifyToken,
    obtenerDetalleGrupoEmpresaController
);

export default router;