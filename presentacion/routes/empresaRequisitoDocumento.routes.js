import { Router } from "express";

import {
    findDocumentosConvenioEmpresa,
    uploadDocumentoConvenioEmpresa,
    replaceDocumentoConvenioEmpresa,
    findRevisionRequisitosEmpresa,
    reviewDocumentoConvenioEmpresa
} from "../controllers/empresaRequisitoDocumentoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";
import { upload } from "../middleware/uploadMulter.js";

const router = Router();

router.get(
    "/empresa/:empresa_id",
    verifyToken,
    findDocumentosConvenioEmpresa
);

router.post(
    "/subir",
    verifyToken,
    verifyRole(["Empresa"]),
    upload.single("archivo"),
    uploadDocumentoConvenioEmpresa
);

router.put(
    "/reemplazar",
    verifyToken,
    verifyRole(["Empresa"]),
    upload.single("archivo"),
    replaceDocumentoConvenioEmpresa
);

router.get(
    "/revision/:empresa_id",
    verifyToken,
    verifyRole(["Director de programa", "Administrador"]),
    findRevisionRequisitosEmpresa
);

router.put(
    "/revisar/:id",
    verifyToken,
    verifyRole(["Director de programa", "Administrador"]),
    reviewDocumentoConvenioEmpresa
);

export default router;