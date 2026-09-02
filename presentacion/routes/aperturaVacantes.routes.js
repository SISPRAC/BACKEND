import { Router } from "express";

import {
    getAperturasVacantesController,
    crearAperturaVacanteController,
    actualizarAperturaVacanteController,
    getAperturaVacanteByIdController,
    eliminarAperturaVacanteController
} from "../controllers/aperturaVacanteController.js";

import { verifyToken } from "../middleware/authMiddleware.js";


const router = Router();


router.post(
    "/crear",
    verifyToken,
    crearAperturaVacanteController
);


router.put(
    "/:id",
    verifyToken,
    actualizarAperturaVacanteController
);


router.get(
    "/all",
    verifyToken,
    getAperturasVacantesController
);


router.get(
    "/:id",
    verifyToken,
    getAperturaVacanteByIdController
);


router.delete(
    "/:id",
    verifyToken,
    eliminarAperturaVacanteController
);


export default router;