import { getTutorEmpresarial } from "../../aplicacion/casos_de_uso/tutorEmpresarial/geTutorEmpresarial.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js";
import { invitarTutorEmpresarial } from "../../aplicacion/casos_de_uso/invitarUsuario/invitarTutorEmpresarial.js";
import { empresaRepository } from "../../infraestructura/repositorios/empresaRepositoryImpl.js";

export const getTutorEmpresarialController = async (req, res) => {
    try {
        const tutorEmpresarial = await getTutorEmpresarial(tutorEmpresaRepository);
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


export const invitarTutorEmpresarialController = async (req, res) => {

    try {

        const { correo } = req.body;

        const usuarioId = req.user.id;

        const empresa =
            await empresaRepository.findByUserId(usuarioId);

        if (!empresa) {
            return res.status(404).json({
                message: "No se encontró la empresa asociada al usuario"
            });
        }

        const resultado =
            await invitarTutorEmpresarial({
                correo,
                empresa_id: empresa.id
            });

        return res.status(200).json(resultado);

    } catch (error) {

        console.log(
            "Error al enviar invitación al tutor empresarial:",
            error
        );

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

