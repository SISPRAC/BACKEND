import jwt from "jsonwebtoken";

export const tokenService = {

    generateInvitationTutorDocenteToken: (correo) => {

        return jwt.sign(
            {
                correo,
                rol: "Tutor Docente"
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "3d"
            }
        );

    },

    generateInvitationTutorEmpresarialToken: (correo, empresa_id) => {

        return jwt.sign(
            {
                correo,
                rol: "Tutor Empresarial",
                empresa_id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "3d"
            }
        );

    },

    generateInvitationCandidatoToken: (correo, codigo) => {

        return jwt.sign(
            {
                correo,
                codigo,
                rol: "Candidato"
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "3d"
            }
        );

    },

    generateInvitationEmpresaToken: (correo) => {

        return jwt.sign(
            {
                correo,
                rol: "Empresa"
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "3d"
            }
        );

    },

    verifyInvitationToken: (token) => {

        return jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

    }

};

