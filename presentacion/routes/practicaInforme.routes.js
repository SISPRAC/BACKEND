import { Router } from "express";

import {

    createPracticaInforme,
    deletePracticaInforme,
    findPracticaInforme,
    findPracticaInformes,
    updatePracticaInforme

} from "../controllers/practicaInformeController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


router.get(

    "/practica/:practica_id",

    verifyToken,

    findPracticaInformes

);


router.post(

    "/crear",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    createPracticaInforme

);


router.delete(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    deletePracticaInforme

);


router.get(

    "/:id",

    verifyToken,

    findPracticaInforme

);


router.put(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    updatePracticaInforme

);


export default router;