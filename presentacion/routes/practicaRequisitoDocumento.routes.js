import { Router } from "express";

import {
    createPracticaRequisitoDocumento,
    updatePracticaRequisitoDocumento,
    deletePracticaRequisitoDocumento,
    findPracticaRequisitoDocumento,
    findPracticaRequisitosDocumento,
    findPracticaRequisitosDocumentoByRol,
    findPracticaRequisitosDocumentoByPractica
} from "../controllers/practicaDocumentoRequisitoController.js";
import { upload } from "../middleware/uploadMulter.js";

const router = Router();

router.post(
    "/",
    upload.single("archivo"),
    createPracticaRequisitoDocumento
);

router.put(
    "/:id",
    upload.single("archivo"),
    updatePracticaRequisitoDocumento
);

router.delete("/:id", deletePracticaRequisitoDocumento);

router.get("/detalle/:id", findPracticaRequisitoDocumento);

router.get(
    "/practica/:practica_id/rol/:rol_id",
    findPracticaRequisitosDocumentoByRol
);

router.get(
    "/practica/:practica_id",
    findPracticaRequisitosDocumentoByPractica
);

export default router;