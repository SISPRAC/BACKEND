import { Router } from "express";

import {

    createPracticaRequisitoDocumento,
    deletePracticaRequisitoDocumento,
    findPracticaRequisitoDocumento,
    findPracticaRequisitosDocumento,
    findPracticaRequisitosDocumentoByRol,
    updatePracticaRequisitoDocumento

} from "../controllers/practicaDocumentoRequisitoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


router.get(

    "/practica/:practica_id",

    verifyToken,

    findPracticaRequisitosDocumento

);


router.get(

    "/practica/:practica_id/rol/:rol_id",

    verifyToken,

    findPracticaRequisitosDocumentoByRol

);


router.post(

    "/crear",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    createPracticaRequisitoDocumento

);


router.delete(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    deletePracticaRequisitoDocumento

);


router.get(

    "/:id",

    verifyToken,

    findPracticaRequisitoDocumento

);


router.put(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    updatePracticaRequisitoDocumento

);


export default router;