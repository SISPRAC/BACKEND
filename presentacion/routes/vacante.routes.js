import { Router } from "express";
import { getAperturasVacantesController, crearVacanteController, actualizarVacanteController, getVacanteByIdController, getVacantesByEmpresaController } from "../controllers/vacanteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
    "/crear",
    verifyToken,
    crearVacanteController
);

router.put(
    "/:id",
    verifyToken,
    actualizarVacanteController
);

router.get(
    "/all",
    verifyToken,
    getAperturasVacantesController
);

router.get(
    "/empresa",
    verifyToken,
    getVacantesByEmpresaController
);

router.get(
    "/:id",
    verifyToken,
    getVacanteByIdController
);

export default router;