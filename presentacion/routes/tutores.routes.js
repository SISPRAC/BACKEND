import { Router } from "express";
import { registerStaff } from "../controllers/staffController.js";
import { uploadDatos } from "../middleware/uploadMulter.js";
import {generateTutorDocenteInvite, generateTutorEmpresarialInvite ,verificarInvitationToken}  from "../controllers/InvitacionController.js";
const router = Router();

router.post(
  "/registerStaff",
  uploadDatos.none(),
  verificarInvitationToken,
  registerStaff
);

router.get("/invitacionTokenTutorEmpresarial",generateTutorEmpresarialInvite);
router.get("/invitacionTokenTutorDocente", generateTutorDocenteInvite);
router.get("/verify-invitation", verificarInvitationToken);

export default router;