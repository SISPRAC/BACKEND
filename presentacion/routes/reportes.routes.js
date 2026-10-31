import { Router } from "express";

import { getDashboardReporteController } from "../controllers/dashboardReporteController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import { verifyRole } from "../middleware/rolMiddleware.js";


const router = Router();


router.get(

    "/dashboard",

    verifyToken,

    verifyRole(["Director de programa"]),

    getDashboardReporteController

);


export default router;