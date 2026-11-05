import { Router } from "express";

import {
    getNotificacionesUsuario,
    getNotificacionesNoLeidas,
    markNotificacionLeida,
    markTodasNotificacionesLeidas
} from "../controllers/notificacionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";


const router = Router();


router.get(

    "/",

    verifyToken,

    getNotificacionesUsuario

);


router.get(

    "/no-leidas",

    verifyToken,

    getNotificacionesNoLeidas

);


router.put(

    "/:id/leida",

    verifyToken,

    markNotificacionLeida

);


router.put(

    "/marcar-todas-leidas",

    verifyToken,

    markTodasNotificacionesLeidas

);


export default router;