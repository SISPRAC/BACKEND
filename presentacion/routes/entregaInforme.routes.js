import { Router } from "express";

import {
    createEntregaInforme,
    findEntregaInforme,
    findEntregasInformeByPracticaInforme,
    findEntregasInformeByPracticaPracticante,
    findEntregasInformeByPracticaPracticanteAndInforme,
    reviewEntregaInformeTutorDocente,
    reviewEntregaInformeTutorEmpresarial
} from "../controllers/entregaInformeController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


router.get(

    "/practica-informe/:practica_informe_id",

    verifyToken,

    findEntregasInformeByPracticaInforme

);


router.get(

    "/practica-practicante/:practica_practicante_id",

    verifyToken,

    findEntregasInformeByPracticaPracticante

);


router.get(

    "/practica-practicante/:practica_practicante_id/informe/:practica_informe_id",

    verifyToken,

    findEntregasInformeByPracticaPracticanteAndInforme

);


router.post(

    "/crear",

    verifyToken,

    verifyRole(["Practicante"]),

    createEntregaInforme

);


router.get(

    "/:id",

    verifyToken,

    findEntregaInforme

);


router.put(

    "/:id/revision/tutor-docente",

    verifyToken,

    verifyRole(["Tutor Docente"]),

    reviewEntregaInformeTutorDocente

);


router.put(

    "/:id/revision/tutor-empresarial",

    verifyToken,

    verifyRole(["Tutor Empresarial"]),

    reviewEntregaInformeTutorEmpresarial

);


export default router;