import { Router } from "express";
import { registerStaff } from "../controllers/staffController.js";
import { uploadDatos } from "../middleware/uploadMulter.js";

const router = Router();
import { verifyInvitationToken } from "../middleware/invitationMiddleware.js";

router.post(
  "/registerStaff",
  uploadDatos.none(),
  verifyInvitationToken ,
  registerStaff
);


export default router;