import { Router } from "express";
import {
    CrearPeriodoController,
    deletePeriodoController,
    getPeriodoController,
    getPeriodosController,
    updatePeriodoController
} from "../controllers/periodoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


router.get(
    "/all",
    verifyToken,
    getPeriodosController
);


router.post(
    "/crear",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    CrearPeriodoController
);


router.delete(
    "/:id",
    verifyToken,
   verifyRole(["Administrador", "Director de programa"]),
    deletePeriodoController
);


router.get(
    "/:id",
    verifyToken,
    getPeriodoController
);


router.put(
    "/:id",
    verifyToken,
    verifyRole(["Administrador", "Director de programa"]),
    updatePeriodoController
);


export default router;