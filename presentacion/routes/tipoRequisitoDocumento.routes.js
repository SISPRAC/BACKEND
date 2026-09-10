import { Router } from "express";

import {

    createTipoRequisitoDocumento,
    deleteTipoRequisitoDocumento,
    findTipoRequisitoDocumento,
    findTiposRequisitoDocumento,
    findTiposRequisitoDocumentoByRol,
    updateTipoRequisitoDocumento

} from "../controllers/tipoRequisitoDocumentoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";

import { upload} from "../middleware/uploadMulter.js";


const router = Router();


router.get(
    "/all",
    verifyToken,
    findTiposRequisitoDocumento
);


router.get(
    "/rol/:rol_id",
    verifyToken,
    findTiposRequisitoDocumentoByRol
);


router.post(
    "/crear",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    upload.single("archivo"),
    createTipoRequisitoDocumento
);


router.delete(
    "/:id",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    deleteTipoRequisitoDocumento
);


router.get(
    "/:id",
    verifyToken,
    findTipoRequisitoDocumento
);


router.put(
    "/:id",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    upload.single("archivo"),
    updateTipoRequisitoDocumento
);

export default router;