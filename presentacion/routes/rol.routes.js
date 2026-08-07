import { Router } from "express";
import { crearRolController, getRolesController } from "../../presentacion/controllers/rolController.js";
const router = Router();

router.post("/crear", crearRolController);
router.get("/roles", getRolesController);

export default router;