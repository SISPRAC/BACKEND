import { Router } from "express";

import {
    verifyInvitationToken,
    validarInvitacionController
} from "../controllers/InvitacionController.js";

const router = Router();

router.get(
    "/validar",
    verifyInvitationToken,
    validarInvitacionController
);

export default router;