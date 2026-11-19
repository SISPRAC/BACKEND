import { Router } from "express";

import {
    registerEmpresaController,
    actualizarEmpresaController,
    obtenerEmpresaController,
    obtenerGruposEmpresaController,
    obtenerDetalleGrupoEmpresaController,
    invitarEmpresaController,
    obtenerEmpresasParaReportePorPeriodoController,
    obtenerEmpresasParaSelectController,
    subirCertificadoFinalizacionController,
    obtenerCertificadoFinalizacionController
} from "../controllers/empresaController.js";

import { uploadImage, upload } from "../middleware/uploadMulter.js";

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

// Empresas para los selects (?convenio=activo | todos)
router.get(
    "/select",
    verifyToken,
    verifyRole(["Director de programa"]),
    obtenerEmpresasParaSelectController
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

// Obtener empresas para el reporte de un período
router.get(
    "/reporte/periodo/:periodo_id",
    verifyToken,
    verifyRole(["Director de programa"]),
    obtenerEmpresasParaReportePorPeriodoController
);

// Subir certificado de finalización (solo la empresa)
router.post(
    "/practicantes/:practicanteId/certificado",
    verifyToken,
    verifyRole(["Empresa"]),
    upload.single("certificado"),
    subirCertificadoFinalizacionController
);

// Consultar certificado de finalización
router.get(
    "/practicantes/:practicanteId/certificado",
    verifyToken,
    verifyRole(["Empresa", "Director de programa", "Tutor docente"]),
    obtenerCertificadoFinalizacionController
);

export default router;