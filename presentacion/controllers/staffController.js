import { createStaffUser} from "../../aplicacion/casos_de_uso/Staff/createStaffUser.js";
import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import {tokenService} from "../../infraestructura/tokenService.js";

export const registerStaff = async (req, res) => {
  try {
    const invitacion = req.invitacion; // 👈 ya viene del middleware
    const rol = invitacion.rol;

    const result = await createStaffUser(
      { userRepository, rolRepository },
      { ...req.body, rol }
    );

    res.status(201).json(result);

  } catch (error) {
     if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
  }
};
