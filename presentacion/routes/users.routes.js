import { Router } from "express";

import {
    deleteUser,
    getUser,
    getUsers,
    updateUserRoles,
    cambiarEstado,
    actualizarPerfilUsuario
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/rolMiddleware.js";

const userRouter = Router();

userRouter.get(
    "/all",
    verifyToken,
    verifyRole(["Administrador"]),
    getUsers
);

userRouter.delete(
    "/:id",
    verifyToken,
    verifyRole(["Administrador"]),
    deleteUser
);

userRouter.get(
    "/me",
    verifyToken,
    getUser
);

userRouter.put(
    "/:id/roles",
    verifyToken,
    verifyRole(["Administrador"]),
    updateUserRoles
);

userRouter.patch(
    "/:id/estado",
    verifyToken,
    cambiarEstado
);

userRouter.put(
    "/perfil",
    verifyToken,
    actualizarPerfilUsuario
);

export default userRouter;