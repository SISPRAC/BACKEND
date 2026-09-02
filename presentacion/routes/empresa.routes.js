import { Router } from "express";

import {
    registerEmpresaController,
    actualizarEmpresaController,
    obtenerEmpresaController,
    obtenerGruposEmpresaController,
    obtenerDetalleGrupoEmpresaController,
    invitarEmpresaController
} from "../controllers/empresaController.js";

import { uploadImage } from "../middleware/uploadMulter.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";
import { verifyInvitationToken } from "../middleware/invitationMiddleware.js";


const router = Router();


router.post(
    "/registrarEmpresa",
    uploadImage.single("logo"),
    verifyInvitationToken,
    registerEmpresaController
);


router.post(
    "/invitacion",
    verifyToken,
    verifyRole(["Director de programa"]),
    invitarEmpresaController
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