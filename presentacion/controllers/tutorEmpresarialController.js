import {getTutorEmpresarial } from "../../aplicacion/casos_de_uso/tutorEmpresarial/geTutorEmpresarial.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";


export const getTutorEmpresarialController = async (req, res) => {
try {
    const tutorEmpresarial = await getTutorEmpresarial(tutorEmpresaRepository );
    res.status(200).json(tutorEmpresarial);
  } catch (error) {
    if (error.statusCode) { 
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error al obtener tutor docentes" 
    
        });
  }
}