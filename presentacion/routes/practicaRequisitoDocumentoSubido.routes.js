import { Router } from "express";

import {
    createPracticaRequisitoDocumentoSubido,
    updatePracticaRequisitoDocumentoSubido,
    findEstadoPracticaRequisitoDocumento,
    findPracticaRequisitoDocumentoSubido,
    findDocumentosPracticantePorPractica,
    findDocumentosEmpresaPorPractica,
    findEmpresasDocumentosPorPractica,
    aprobarDocumentoRequisito,
    rechazarDocumentoRequisito,
} from "../controllers/practicaRequisitoDocumentoSubidoController.js";

import { upload } from "../middleware/uploadMulter.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Obtener los documentos de requisitos del usuario autenticado
router.get(
    "/mis-documentos",
    verifyToken,
    findEstadoPracticaRequisitoDocumento
);

// Obtener los documentos de las empresas por práctica
router.get(
    "/empresas/practica/:practica_id",
    verifyToken,
    findEmpresasDocumentosPorPractica
);

// Obtener los documentos de una empresa por usuario y práctica
router.get(
    "/empresa/:usuario_id/practica/:practica_id",
    verifyToken,
    findDocumentosEmpresaPorPractica
);

// Obtener los documentos de un practicante por usuario y práctica
router.get(
    "/practicante/:usuario_id/practica/:practica_id",
    verifyToken,
    findDocumentosPracticantePorPractica
);

// Aprobar un documento de requisito
router.patch(
    "/:id/aprobar",
    verifyToken,
    aprobarDocumentoRequisito
);

// Rechazar un documento de requisito
router.patch(
    "/:id/rechazar",
    verifyToken,
    rechazarDocumentoRequisito
);

// Obtener un documento subido por su ID
router.get(
    "/:id",
    verifyToken,
    findPracticaRequisitoDocumentoSubido
);

// Subir un documento de requisito por primera vez
router.post(
    "/",
    verifyToken,
    upload.single("archivo"),
    createPracticaRequisitoDocumentoSubido
);

// Editar un documento de requisito existente
router.put(
    "/",
    verifyToken,
    upload.single("archivo"),
    updatePracticaRequisitoDocumentoSubido
);

export default router;