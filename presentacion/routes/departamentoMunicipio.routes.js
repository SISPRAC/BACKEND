import express from "express";

import {
    getDepartamentos,
    getMunicipiosPorDepartamento
} from "../controllers/departamentMunicipioController.js";

const router = express.Router();

router.get("/", getDepartamentos);

router.get(
    "/:departamentoId/municipios",
    getMunicipiosPorDepartamento
);

export default router;