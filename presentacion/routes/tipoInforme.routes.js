import { Router } from "express";

import {

    createTipoInforme,
    deleteTipoInforme,
    findTipoInforme,
    findTiposInforme,
    updateTipoInforme

} from "../controllers/tipoInformeController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


router.get(

    "/all",

    verifyToken,

    findTiposInforme

);


router.post(

    "/crear",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    createTipoInforme

);


router.delete(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    deleteTipoInforme

);


router.get(

    "/:id",

    verifyToken,

    findTipoInforme

);


router.put(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    updateTipoInforme

);


export default router;