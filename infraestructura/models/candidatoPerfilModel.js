import { DataTypes } from "sequelize";

const createCandidatoPerfilModel = (sequelize) => {

    const CandidatoPerfil = sequelize.define("Candidato_perfil", {

        candidato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Candidatos",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        perfil_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Perfils",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        nivel: {
            type: DataTypes.STRING(2),
            allowNull: false,

            validate: {
                isIn: [["R", "B", "MB"]]
            }
        }

    }, {
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["candidato_id", "perfil_id"]
            }
        ]
    });

    return CandidatoPerfil;
};

export default createCandidatoPerfilModel;