import { Router } from "express";
import { listarRespaldosController } from "../controllers/periodoRespaldoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const router = Router();

router.get(
    "/all",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    listarRespaldosController
);

export default router;
