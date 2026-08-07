// presentacion/controllers/inviteController.js
import { tokenService } from "../../infraestructura/tokenService.js";

export const generateTutorDocenteInvite = async (req, res) => {
  try {
    const token = tokenService.generateInvitationTutorDocenteToken();
    res.status(200).json(token );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateTutorEmpresarialInvite = async (req, res) => {
  try {
    const token = tokenService.generateInvitationTutorEmpresarialToken();
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verificarInvitationToken = (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        message: "Token requerido",
      });
    }

    const decoded = tokenService.verifyInvitationToken(token);

    // 🔥 SI ES GET → RESPONDE AQUÍ
    if (req.method === "GET") {
      return res.json({
        valid: true,
        data: decoded,
      });
    }

    // 🔥 SI ES POST → CONTINÚA
    req.invitacion = decoded;
    next();


  } catch (error) {
    return res.status(400).json({
      message: "Token inválido o expirado",
    });
  }
};