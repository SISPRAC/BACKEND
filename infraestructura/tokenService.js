import jwt from "jsonwebtoken";

export const tokenService = {
  generateInvitationTutorDocenteToken: (rol = "Tutor Docente") => {
    return jwt.sign({ rol }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
  },
  generateInvitationTutorEmpresarialToken: (rol = "Tutor Empresarial") => {
    return jwt.sign({ rol }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
  },
  verifyInvitationToken: (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }
};
