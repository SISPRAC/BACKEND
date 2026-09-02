import { createStaffUser } from "../../aplicacion/casos_de_uso/Staff/createStaffUser.js";

import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { rolRepository } from "../../infraestructura/repositorios/rolRepositoryImpl.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";


export const registerStaff = async (req, res) => {

    try {

        const invitacion = req.invitacion;

        const result = await createStaffUser(
            sequelize,

            {
                userRepository,
                rolRepository,
                TutorDocenteRepository,
                tutorEmpresaRepository
            },

            {
                ...req.body,

                // Datos controlados por la invitación
                rol: invitacion.rol,
                correo: invitacion.correo,
                empresa_id: invitacion.empresa_id
            }
        );

        return res.status(201).json(result);

    } catch (error) {

        console.log("Error al registrar staff:", error);

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

