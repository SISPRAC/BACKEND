import { Router } from "express";
import { registerEmpresaController } from "../controllers/empresaController.js";
import { uploadImage } from "../middleware/uploadMulter.js";

const router = Router();

router.post(
    "/registrarEmpresa",
    uploadImage.single("logo"), 
    registerEmpresaController
);

export default router;