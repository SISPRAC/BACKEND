import { Router } from "express";

import {

    createPracticaRequisitoDocumento,
    deletePracticaRequisitoDocumento,
    findPracticaRequisitoDocumento,
    findPracticaRequisitosDocumento,
    findPracticaRequisitosDocumentoByRol,
    findRequisitosPracticanteVigentes,
    findInformesPracticanteVigentes,
    updatePracticaRequisitoDocumento

} from "../controllers/practicaDocumentoRequisitoController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


// ============================================================
// REQUISITOS DE UNA PRÁCTICA
// ============================================================

router.get(

    "/practica/:practica_id",

    verifyToken,

    findPracticaRequisitosDocumento

);


// ============================================================
// REQUISITOS DE UNA PRÁCTICA POR ROL
// ============================================================

router.get(

    "/practica/:practica_id/rol/:rol_id",

    verifyToken,

    findPracticaRequisitosDocumentoByRol

);


// ============================================================
// REQUISITOS VIGENTES DEL PRACTICANTE
// ============================================================

router.get(

    "/practicante/vigentes",

    verifyToken,

    findRequisitosPracticanteVigentes

);


// ============================================================
// INFORMES VIGENTES DEL PRACTICANTE
// ============================================================

router.get(

    "/practicante/informes/vigentes",

    verifyToken,

    findInformesPracticanteVigentes

);


// ============================================================
// CREAR
// ============================================================

router.post(

    "/crear",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    createPracticaRequisitoDocumento

);


// ============================================================
// ELIMINAR
// ============================================================

router.delete(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    deletePracticaRequisitoDocumento

);


// ============================================================
// OBTENER UNO
// ============================================================

router.get(

    "/:id",

    verifyToken,

    findPracticaRequisitoDocumento

);


// ============================================================
// ACTUALIZAR
// ============================================================

router.put(

    "/:id",

    verifyToken,

    verifyRole(["Administrador", "Director de programa"]),

    updatePracticaRequisitoDocumento

);


export default router;