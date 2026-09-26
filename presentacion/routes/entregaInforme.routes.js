import { Router } from "express";

import {
    createEntregaInforme,
    findEntregaInformeByPracticante,
    findTrazabilidadEntregaInforme,
    reviewEntregaInformeTutorDocente,
    reviewEntregaInformeTutorEmpresarial
} from "../controllers/entregaInformeController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

import { upload } from "../middleware/uploadMulter.js";


const router = Router();

// ============================================================
// OBTENER ENTREGAS DE UN PRACTICANTE POR TIPO DE DOCUMENTO
// ============================================================

router.get(

    "/practicante/:practicante_id/tipo/:tipo_requisito_documento_id",

    verifyToken,

    findEntregaInformeByPracticante

);


// ============================================================
// TRAZABILIDAD DE ENTREGAS
// ============================================================

router.get(

    "/trazabilidad/practicante/:practicante_id/tipo/:tipo_requisito_documento_id",

    verifyToken,

    findTrazabilidadEntregaInforme

);

// ============================================================
// CREAR ENTREGA
// ============================================================

router.post(
    "/crear",
    verifyToken,
    verifyRole(["Practicante"]),
    upload.single("archivo"),
    createEntregaInforme
);

// ============================================================
// REVISIÓN TUTOR DOCENTE
// ============================================================

router.put(

    "/:id/revision/tutor-docente",

    verifyToken,

    verifyRole(["Tutor Docente"]),

    reviewEntregaInformeTutorDocente

);

// ============================================================
// REVISIÓN TUTOR EMPRESARIAL
// ============================================================

router.put(

    "/:id/revision/tutor-empresarial",

    verifyToken,

    verifyRole(["Tutor Empresarial"]),

    reviewEntregaInformeTutorEmpresarial

);


export default router;