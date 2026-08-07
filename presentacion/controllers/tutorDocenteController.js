import { getTutorDocentes } from "../../aplicacion/casos_de_uso/tutorDocente/getTutorDocentes.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";

export const getTutorDocentesController = async (req, res) => {
try {
    const tutorDocentes = await getTutorDocentes( TutorDocenteRepository);
    res.status(200).json(tutorDocentes);
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